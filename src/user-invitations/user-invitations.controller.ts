import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserInvitationsService } from './user-invitations.service';
import { CreateUserInvitationDto } from './dto/create-user-invitation.dto';
import { UpdateUserInvitationDto } from './dto/update-user-invitation.dto';

@Controller('user-invitations')
export class UserInvitationsController {
  constructor(private readonly userInvitationsService: UserInvitationsService) {}

  @Post()
  create(@Body() createUserInvitationDto: CreateUserInvitationDto) {
    return this.userInvitationsService.create(createUserInvitationDto);
  }

  @Get()
  findAll() {
    return this.userInvitationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userInvitationsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserInvitationDto: UpdateUserInvitationDto) {
    return this.userInvitationsService.update(+id, updateUserInvitationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userInvitationsService.remove(+id);
  }
}
