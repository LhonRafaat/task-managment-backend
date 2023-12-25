import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  priority: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  labels: string[];

  @ApiProperty()
  @IsString()
  assignee: string;

  @ApiProperty()
  startDate: string;

  @ApiProperty()
  endDate: string;
}
