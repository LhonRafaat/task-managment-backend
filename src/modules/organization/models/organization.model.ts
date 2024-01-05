import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongoose';
import { TUser } from '../../users/user.model';
import { TProject } from '../../project/models/project.model';

export class TOrganization {
  @ApiProperty()
  _id: ObjectId;

  @ApiProperty()
  title: ObjectId;

  @ApiProperty()
  description: ObjectId;

  @ApiProperty()
  owner: ObjectId;

  @ApiProperty()
  members: [TUser];

  @ApiProperty()
  projects: [TProject];

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}
