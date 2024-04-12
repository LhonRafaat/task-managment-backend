import { ApiProperty } from '@nestjs/swagger';
import { TOrganization } from '../../modules/organization/models/organization.model';

export class TUserInvitation {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  organization: TOrganization;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}
