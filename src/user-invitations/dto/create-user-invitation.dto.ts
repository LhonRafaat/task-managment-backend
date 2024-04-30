import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserInvitationDto {
  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  emails: string[];

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  organization: string;
}
