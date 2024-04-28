import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TUser } from './user.model';
import { RegisterPayload } from '../auth/dto/register.payload';
import * as bcrypt from 'bcrypt';
import { IQuery, IRequest, TResponse } from '../../common/helper/common-types';
import { OrganizationService } from '../organization/organization.service';
import { TOrganization } from '../organization/models/organization.model';
import { AcceptInvitePayload } from '../auth/dto/accept-invite.payload';
import { UserInvitationsService } from '../../user-invitations/user-invitations.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<TUser>,
    private readonly organizationService: OrganizationService,
    private readonly userInvitationService: UserInvitationsService,
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
  ): Promise<TResponse<TUser>> {
    const users = this.userModel
      .find({
        ...req.searchObj,
        ...req.dateQr,
        organization: req.user.organization._id,
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
      isAdmin: true,
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
    const user = await this.findByEmail(invitation.email);

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
    if (!user) throw new BadRequestException('User not found');
    return user;
  }

  async update(id: string, updateUserDto: Partial<TUser>): Promise<TUser> {
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
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
      console.log('not isMatch');
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
    console.log('id', id);

    // await this.findOne(id);
    await this.userModel.findByIdAndDelete(id);

    return { message: `User with id ${id} deleted` };
  }
}
