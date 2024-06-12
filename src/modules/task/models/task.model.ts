import { ApiProperty } from '@nestjs/swagger';
import { TUser } from '../../users/user.model';
import { TProject } from '../../project/models/project.model';

export class TTask {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  priority: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  group: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  project: TProject;

  @ApiProperty()
  type: string;

  @ApiProperty()
  labels: string[];

  @ApiProperty()
  reporter: TUser;

  @ApiProperty()
  assignee: TUser;

  @ApiProperty()
  currentColumn: string;

  @ApiProperty()
  startDate: string;

  @ApiProperty()
  endDate: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}
