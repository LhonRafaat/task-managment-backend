import { PartialType } from '@nestjs/swagger';
import { CreateUserInvitationDto } from './create-user-invitation.dto';

export class UpdateUserInvitationDto extends PartialType(CreateUserInvitationDto) {}
