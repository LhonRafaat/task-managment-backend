import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateUserInvitationDto } from './dto/create-user-invitation.dto';
import { UpdateUserInvitationDto } from './dto/update-user-invitation.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TUserInvitation } from './models/user-invitation.type';
import { IRequest } from '../common/helper/common-types';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { OrganizationService } from '../modules/organization/organization.service';
import { UsersService } from '../modules/users/users.service';

@Injectable()
export class UserInvitationsService {
  constructor(
    @InjectModel('UserInvitation')
    private readonly userInvitationModel: Model<TUserInvitation>,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    private readonly organizationService: OrganizationService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
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
      let url =
        this.configService.get('FRONTEND_URL') + `invite?id=` + invitation._id;
      const user = await this.usersService.findByEmail(email);
      if (user) {
        url =
          this.configService.get('FRONTEND_URL') +
          `invite/accept?id=` +
          invitation._id;
      }
      this.mailerService
        .sendMail({
          to: email, // list of receivers
          from: 'noreply@taskmanagment.com', // sender address
          subject: `بانگێشت کراوی بۆ ${organization.title}`, // Subject line
          html: `<body dir="rtl" style="font-family: Arial, sans-serif; margin: 0; padding: 0;">

<!-- Header Section -->
<div style="background-color: #f5f5f5; padding: 20px;">
   TSM
</div>

<!-- Content Section -->
<div style="padding: 20px;">
    <h2 style="color: #333;">بەشدار بە لە رێکخراوەکەمان!</h2>
    <p style="color: #666;">بەڕێز ${email}،</p>
    <p style="color: #666;">ئێمە بانگێشت لێ دەکەین کە بەشداری  بکەیت لە ڕێکخراوەکەمان . وەک ئەندامێک، دەتوانیت سوود و دەرفەتی تایبەتت هەبێت بۆ هاوکاریکردن لەگەڵ کەسانی هاوشێوە.</p>
    <p style="color: #666;">بۆ قبوڵکردن تکایە ئەو دوگمەیەی خوارەوە دابگرە</p>
    <a href="${url}" style="display: inline-block; background-color: #007bff; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 5px; margin-top: 20px;">قبوڵکردن</a>
    <p style="color: #666; margin-top: 20px;">ئەگەر هەر پرسیارێک یاخود هاوکاریەک پێویست بوو تکایە پەیوەندیمان پێوە بکە.</p>
    <p style="color: #666; font-size: 48px;">${organization.title},</p>
</div>

<!-- Footer Section -->
<div style="background-color: #f5f5f5; padding: 20px; text-align: center;">
    <p style="color: #666; margin: 0;">© 2024 TSM. All rights reserved.</p>
</div>

</body>`,
        })
        .then(() => console.log('Email sent'))
        .catch((e) => console.log(e));
    }

    return { message: 'success' };
  }

  async reinvite(
    createUserInvitationDto: CreateUserInvitationDto,
    req: IRequest,
  ): Promise<{ message: string }> {
    const organization = await this.organizationService.findOne(
      createUserInvitationDto.organization,
    );
    for await (const email of createUserInvitationDto.emails) {
      const user = await this.usersService.findByEmail(email);
      const checkInvitation = await this.userInvitationModel.findOne({
        email,
        organization: organization._id,
      });

      if (checkInvitation) {
        await this.userInvitationModel.findByIdAndDelete(checkInvitation._id);
      }

      const invitation = await this.userInvitationModel.create({
        ...createUserInvitationDto,
        email,
        expiryDate: new Date(
          new Date().toString() + 7 * 24 * 60 * 60 * 1000,
        ).toISOString(),
      });
      let url =
        this.configService.get('FRONTEND_URL') + `invite?id=` + invitation._id;
      if (user) {
        url =
          this.configService.get('FRONTEND_URL') +
          `invite/accept?id=` +
          invitation._id;
      }
      this.mailerService
        .sendMail({
          to: email, // list of receivers
          from: 'noreply@taskmanagment.com', // sender address
          subject: `بانگێشت کراوی بۆ ${organization.title}`, // Subject line
          html: `<body dir="rtl" style="font-family: Arial, sans-serif; margin: 0; padding: 0;">

<!-- Header Section -->
<div style="background-color: #f5f5f5; padding: 20px;">
   TSM
</div>

<!-- Content Section -->
<div style="padding: 20px;">
    <h2 style="color: #333;">بەشدار بە لە رێکخراوەکەمان!</h2>
    <p style="color: #666;">بەڕێز ${email}،</p>
    <p style="color: #666;">ئێمە بانگێشت لێ دەکەین کە بەشداری  بکەیت لە ڕێکخراوەکەمان . وەک ئەندامێک، دەتوانیت سوود و دەرفەتی تایبەتت هەبێت بۆ هاوکاریکردن لەگەڵ کەسانی هاوشێوە.</p>
    <p style="color: #666;">بۆ قبوڵکردن تکایە ئەو دوگمەیەی خوارەوە دابگرە</p>
    <a href="${url}" style="display: inline-block; background-color: #007bff; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 5px; margin-top: 20px;">قبوڵکردن</a>
    <p style="color: #666; margin-top: 20px;">ئەگەر هەر پرسیارێک یاخود هاوکاریەک پێویست بوو تکایە پەیوەندیمان پێوە بکە.</p>
    <p style="color: #666; font-size: 48px;">${organization.title},</p>
</div>

<!-- Footer Section -->
<div style="background-color: #f5f5f5; padding: 20px; text-align: center;">
    <p style="color: #666; margin: 0;">© 2024 TSM. All rights reserved.</p>
</div>

</body>`,
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
    const doc = await this.findOne(id);
    await this.userInvitationModel.findByIdAndUpdate(
      id,
      updateUserInvitationDto,
    );
    await this.userInvitationModel.findByIdAndDelete(doc._id);

    return doc;
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);

    await this.userInvitationModel.findByIdAndDelete(id);
  }

  async deleteAll() {
    await this.userInvitationModel.deleteMany({});
  }
}
