import { ApiProperty } from '@nestjs/swagger';

export class TNotification {
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
}
