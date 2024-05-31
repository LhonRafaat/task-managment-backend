import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { TUser } from './user.model';
import { RegisterPayload } from '../auth/dto/register.payload';
import * as bcrypt from 'bcrypt';
import { IQuery, IRequest, TResponse } from '../../common/helper/common-types';
import { OrganizationService } from '../organization/organization.service';
import { TOrganization } from '../organization/models/organization.model';
import { AcceptInvitePayload } from '../auth/dto/accept-invite.payload';
import { UserInvitationsService } from '../../user-invitations/user-invitations.service';
import { InvitationStatus } from '../../user-invitations/user-invitation.schema';
import { ConfigService } from '@nestjs/config';
import { IToken } from '../tokens/token.schema';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<TUser>,
    @InjectModel('Token') private readonly tokenModel: Model<IToken>,
    private readonly organizationService: OrganizationService,
    private readonly userInvitationService: UserInvitationsService,
    private readonly mailerService: MailerService,
  ) {}

  async findAll(req: IRequest, query: IQuery): Promise<TResponse<TUser>> {
    const users = this.userModel
      .find({
        ...req.searchObj,
        ...req.dateQr,
      })
      .sort({ [query.sort]: query.orderBy === 'desc' ? -1 : 1 });

    const total = await users.clone().count();

    users.limit(+query.limit).skip(req.skip);

    const response: TResponse<TUser> = {
      result: await users.exec(),
      count: total,
      limit: +query.limit,
      page: +query.page,
    };

    return response;
  }
  async findMyOrganizationUsers(
    req: IRequest,
    query: IQuery,
    organizationId: string,
  ): Promise<TResponse<TUser>> {
    const users = this.userModel
      .find({
        ...req.searchObj,
        ...req.dateQr,
        organization: organizationId,
      })
      .sort({ [query.sort]: query.orderBy === 'desc' ? -1 : 1 });

    const total = await users.clone().count();

    users.limit(+query.limit).skip(req.skip);

    const response: TResponse<TUser> = {
      result: await users.exec(),
      count: total,
      limit: +query.limit,
      page: +query.page,
    };

    return response;
  }

  async create(payload: RegisterPayload) {
    let organization: TOrganization | null = null;
    organization = await this.organizationService.findByTitle(
      payload.organization,
    );

    if (organization)
      throw new BadRequestException('Organization already exists');

    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(payload.password, saltOrRounds);

    const user = await this.userModel.create({
      ...payload,
      password: hashedPassword,
      organization: null,
    });

    organization = await this.organizationService.create({
      title: payload.organization,
      owner: user._id,
    });

    return await this.userModel.findByIdAndUpdate(
      user._id,
      {
        organization: organization._id,
      },
      {
        new: true,
        runValidators: true,
      },
    );
  }

  async joinOrganization(payload: AcceptInvitePayload) {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(payload.password, saltOrRounds);
    const invitation = await this.userInvitationService.findOne(
      payload.invitationId,
    );
    if (invitation.status !== InvitationStatus.Pending)
      throw new BadRequestException('basarchwa');
    const user = await this.findByEmail(invitation.email);

    await this.userInvitationService.update(invitation._id, {
      status: InvitationStatus.Approved,
    });

    if (!user) {
      return await this.userModel.create({
        ...payload,
        password: hashedPassword,
        organization: invitation.organization,
        email: invitation.email,
      });
    } else {
      return await this.userModel.findByIdAndUpdate(
        user._id,
        {
          $push: { organization: invitation.organization },
        },
        {
          new: true,
          runValidators: true,
        },
      );
    }
  }

  async findOne(id: string): Promise<TUser> {
    const user = await this.userModel.findById(id).populate('organization');
    if (!user) throw new BadRequestException('User not found');
    return user;
  }

  async findByEmail(email: string): Promise<TUser> {
    const user = await this.userModel.findOne({ email }).select('+password');
    // if (!user) throw new BadRequestException('User not found');
    return user;
  }

  async update(id: string, updateUserDto: Partial<TUser>): Promise<TUser> {
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  async removeFromOrganization(
    id: string,
    updateUserDto: { organizationId: string },
  ): Promise<TUser> {
    const user = await this.userModel.findById(id);
    user.organization = user.organization.filter(
      (el) => el.toString() !== updateUserDto.organizationId.toString(),
    );

    return await user.save();
  }

  async changePassword(
    id: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.userModel.findById(id).select('+password');
    if (!user) throw new BadRequestException('User not found');

    // check if current password is correct
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException('Incorrect password');
    }

    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltOrRounds);

    return await this.userModel
      .findByIdAndUpdate(id, {
        password: hashedPassword,
      })
      .exec();
  }

  async remove(id: string): Promise<{ message: string }> {
    // await this.findOne(id);
    await this.userModel.findByIdAndDelete(id);

    return { message: `User with id ${id} deleted` };
  }

  async forgotPassword({ email }: { email: string }) {
    const configService = new ConfigService();
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotAcceptableException(
        'The account with the provided email does not exist. Please try another one.',
      );
    }
    let token = await this.tokenModel.findOne({
      user: user._id,
    });
    if (!token) {
      token = await new this.tokenModel({
        user: user._id,
        token: crypto.randomBytes(32).toString('hex'),
      });
      await token.save();
    }
    const link = `${configService.get('FRONTEND_URL')}reset-password/${
      user._id
    }/${token.token}`;
    try {
      this.mailerService
        .sendMail({
          to: email, // list of receivers
          from: 'noreply@taskmanagment.com', // sender address
          subject: `گۆڕینی تێپەڕه وشە `, // Subject line
          text: link,
        })
        .then(() => console.log('Email sent'))
        .catch((e) => console.log(e));
    } catch (e) {
      throw new BadRequestException({
        message: { en: 'Failed to send email', ku: 'سلاو', ar: 'سلاو' },
      });
    }
    return user;
  }

  async resetPassword(
    id: string,
    token: string,
    password: string,
  ): Promise<TUser> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotAcceptableException(
        'The account with the provided email does not exist. Please try another one.',
      );
    }
    const tokenDoc = await this.tokenModel.findOne({
      user: user._id,
      token,
    });
    if (!tokenDoc) {
      throw new NotAcceptableException(
        'The token provided is invalid. Please try again.',
      );
    }

    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);
    user.password = hashedPassword;
    await tokenDoc.deleteOne();

    return await user.save();
  }

  async checkIsOwner(
    req: IRequest,
    organizationId: string,
  ): Promise<{ isOwner: boolean }> {
    const organization = await this.organizationService.findOne(organizationId);

    return {
      isOwner: organization.owner?.toString() === req.user._id?.toString(),
    };
  }
}
