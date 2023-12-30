import { ApiProperty } from '@nestjs/swagger';
import { TTask } from '../../task/models/task.model';
import { TUser } from '../../users/user.model';

export class TProject {
  @ApiProperty()
  title: string;

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
}
