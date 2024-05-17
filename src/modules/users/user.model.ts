import { ApiProperty } from '@nestjs/swagger';
import { TOrganization } from '../organization/models/organization.model';

export class TUser {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  avatar: string;

  @ApiProperty()
  organization: TOrganization[];

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}
