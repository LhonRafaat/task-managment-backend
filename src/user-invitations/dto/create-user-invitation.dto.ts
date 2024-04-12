import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';

export class CreateUserInvitationDto {
  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  emails: string;
}
