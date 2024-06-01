import { ApiProperty } from '@nestjs/swagger';

export class TNotification {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  projectId: string;

  @ApiProperty()
  taskId: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  read: boolean;

  @ApiProperty()
  description: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}
