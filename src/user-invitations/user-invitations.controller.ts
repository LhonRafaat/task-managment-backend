import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserInvitationsService } from './user-invitations.service';
import { CreateUserInvitationDto } from './dto/create-user-invitation.dto';
import { UpdateUserInvitationDto } from './dto/update-user-invitation.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { TUserInvitation } from './models/user-invitation.type';
import { IRequest } from '../common/helper/common-types';

@Controller('user-invitations')
@ApiTags('UserInvitations')
export class UserInvitationsController {
  constructor(
    private readonly userInvitationsService: UserInvitationsService,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({
    type: TUserInvitation,
  })
  create(
    @Body() createUserInvitationDto: CreateUserInvitationDto,
    @Req() req: IRequest,
  ) {
    return this.userInvitationsService.create(createUserInvitationDto, req);
  }

  @Post('reinvite')
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({
    type: TUserInvitation,
  })
  reinvite(
    @Body() createUserInvitationDto: CreateUserInvitationDto,
    @Req() req: IRequest,
  ) {
    return this.userInvitationsService.reinvite(createUserInvitationDto, req);
  }

  @Get('organization/:organizationId')
  @UseGuards(AuthGuard('jwt'))
  findAll(@Req() req: IRequest, @Param('organizationId') organizationId) {
    return this.userInvitationsService.findAll(req, organizationId);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({
    type: TUserInvitation,
  })
  findOne(@Param('id') id: string) {
    return this.userInvitationsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({
    type: TUserInvitation,
  })
  update(
    @Param('id') id: string,
    @Body() updateUserInvitationDto: UpdateUserInvitationDto,
  ) {
    return this.userInvitationsService.update(id, updateUserInvitationDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({
    type: TUserInvitation,
  })
  remove(@Param('id') id: string) {
    return this.userInvitationsService.remove(id);
  }
}
