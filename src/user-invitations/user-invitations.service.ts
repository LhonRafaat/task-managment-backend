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

  findAll() {
    return `This action returns all userInvitations`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userInvitation`;
  }

  update(id: number, updateUserInvitationDto: UpdateUserInvitationDto) {
    return `This action updates a #${id} userInvitation`;
  }

  remove(id: number) {
    return `This action removes a #${id} userInvitation`;
  }
}
