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
  UseGuards,
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
import { TTask } from './models/task.model';
import { AuthGuard } from '@nestjs/passport';

@Controller('task')
@ApiBearerAuth()
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Req() req: IRequest, @Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(createTaskDto, req);
  }

  @Get('project/:id')
  @ApiOkResponse(getResponseType(TTask))
  findAll(
    @Req() req: IRequest,
    @Query() query: IQuery,
    @Param('id') id: string,
  ) {
    return this.taskService.findAll(query, req, id);
  }

  @Get('status')
  getStatus(@Req() req: IRequest, @Query('projectId') projectId: string) {
    return this.taskService.taskStatus(projectId, req);
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
