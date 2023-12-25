import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import {
  IQuery,
  IRequest,
  getResponseType,
} from '../../common/helper/common-types';
import { TUser } from '../users/user.model';
import { TTask } from './models/task.model';

@Controller('task')
@ApiBearerAuth()
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(createTaskDto);
  }

  @Get()
  @ApiOkResponse(getResponseType(TUser))
  findAll(@Req() req: IRequest, @Query() query: IQuery) {
    return this.taskService.findAll(query, req);
  }

  @Get(':id')
  @ApiOkResponse({ type: TTask })
  findOne(@Param('id') id: string) {
    return this.taskService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: TTask })
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update(id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskService.remove(id);
  }
}
