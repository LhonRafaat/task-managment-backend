import { Injectable } from '@nestjs/common';
import { CreateUserInvitationDto } from './dto/create-user-invitation.dto';
import { UpdateUserInvitationDto } from './dto/update-user-invitation.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TUserInvitation } from './models/user-invitation.type';
import { IRequest } from '../common/helper/common-types';

@Injectable()
export class UserInvitationsService {
  constructor(
    @InjectModel('UserInvitation')
    private readonly userInvitationModel: Model<TUserInvitation>,
  ) {}

  async create(
    createUserInvitationDto: CreateUserInvitationDto,
    req: IRequest,
  ): Promise<{ message: string }> {
    for await (const email of createUserInvitationDto.emails) {
      await this.userInvitationModel.create({
        ...createUserInvitationDto,
        organization: req.user.organization._id,
        email,
        expiryDate: new Date(
          new Date().toString() + 7 * 24 * 60 * 60 * 1000,
        ).toISOString(),
      });
    }

    return { message: 'success ' };
  }

  async findAll(): Promise<TUserInvitation[]> {
    return await this.userInvitationModel.find();
  }

  async findOne(id: string): Promise<TUserInvitation> {
    const userInvitation = await this.userInvitationModel.findById(id);

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
