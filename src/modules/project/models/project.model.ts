import { ApiProperty } from '@nestjs/swagger';
import { TTask } from '../../task/models/task.model';
import { TUser } from '../../users/user.model';
import { TOrganization } from '../../organization/models/organization.model';

export class TProject {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  image: string;

  @ApiProperty()
  organization: TOrganization;

  @ApiProperty()
  description: string;

  @ApiProperty()
  endDate: string;

  @ApiProperty()
  startDate: string;

  @ApiProperty()
  boardColumns: string[];

  @ApiProperty()
  leadUser: TUser;

  @ApiProperty()
  members: TUser[];

  @ApiProperty()
  slug: string;

  @ApiProperty()
  tasks: TTask[];

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}
