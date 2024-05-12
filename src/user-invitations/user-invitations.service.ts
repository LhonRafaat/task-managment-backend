import { Injectable } from '@nestjs/common';
import { CreateUserInvitationDto } from './dto/create-user-invitation.dto';
import { UpdateUserInvitationDto } from './dto/update-user-invitation.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TUserInvitation } from './models/user-invitation.type';
import { IRequest } from '../common/helper/common-types';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { OrganizationService } from '../modules/organization/organization.service';

@Injectable()
export class UserInvitationsService {
  constructor(
    @InjectModel('UserInvitation')
    private readonly userInvitationModel: Model<TUserInvitation>,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    private readonly organizationService: OrganizationService,
  ) {}

  async create(
    createUserInvitationDto: CreateUserInvitationDto,
    req: IRequest,
  ): Promise<{ message: string }> {
    const organization = await this.organizationService.findOne(
      createUserInvitationDto.organization,
    );
    for await (const email of createUserInvitationDto.emails) {
      const invitation = await this.userInvitationModel.create({
        ...createUserInvitationDto,
        email,
        expiryDate: new Date(
          new Date().toString() + 7 * 24 * 60 * 60 * 1000,
        ).toISOString(),
      });

      this.mailerService
        .sendMail({
          to: email, // list of receivers
          from: 'noreply@taskmanagment.com', // sender address
          subject: `بانگێشت کراوی بۆ ${organization.title}`, // Subject line
          text:
            this.configService.get('FRONTEND_URL') +
            `invite?id=` +
            invitation._id,
        })
        .then(() => console.log('Email sent'))
        .catch((e) => console.log(e));
    }

    return { message: 'success' };
  }

  async findAll(req: IRequest, organization): Promise<TUserInvitation[]> {
    return await this.userInvitationModel.find({
      organization,
    });
  }

  async findOne(id: string): Promise<TUserInvitation> {
    const userInvitation = await this.userInvitationModel
      .findById(id)
      .populate('organization');

    if (!userInvitation) throw new Error('UserInvitation not found');

    return userInvitation;
  }

  async update(
    id: string,
    updateUserInvitationDto: UpdateUserInvitationDto,
  ): Promise<TUserInvitation> {
    await this.findOne(id);
    return await this.userInvitationModel.findByIdAndUpdate(
      id,
      updateUserInvitationDto,
    );
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);

    await this.userInvitationModel.findByIdAndDelete(id);
  }
}
