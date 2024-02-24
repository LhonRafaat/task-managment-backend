import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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
  @IsOptional()
  type: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  image: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  endDate: string;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  boardColumns: string[];

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
