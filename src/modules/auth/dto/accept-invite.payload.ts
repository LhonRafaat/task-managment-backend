import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AcceptInvitePayload {
  @ApiProperty()
  @IsOptional()
  @IsString()
  fullName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  invitationId: string;

  @ApiProperty()
  @IsOptional()
  avatar: string;
}
