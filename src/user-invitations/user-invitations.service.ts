import { Injectable } from '@nestjs/common';
import { CreateUserInvitationDto } from './dto/create-user-invitation.dto';
import { UpdateUserInvitationDto } from './dto/update-user-invitation.dto';

@Injectable()
export class UserInvitationsService {
  create(createUserInvitationDto: CreateUserInvitationDto) {
    return 'This action adds a new userInvitation';
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
