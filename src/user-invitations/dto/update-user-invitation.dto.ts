import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserInvitationDto {
  @ApiProperty()
  status: string;
}
