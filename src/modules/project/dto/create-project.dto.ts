import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  endDate: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  boardColumns: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  leadUser: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  members: string[];

  @ApiProperty()
  @IsString()
  @IsOptional()
  tasks: string[];
}
