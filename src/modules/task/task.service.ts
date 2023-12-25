import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TTask } from './models/task.model';
import { IQuery, IRequest, TResponse } from '../../common/helper/common-types';

@Injectable()
export class TaskService {
  constructor(@InjectModel('Task') private readonly taskModel: Model<TTask>) {}

  async create(createTaskDto: CreateTaskDto): Promise<TTask> {
    return await this.taskModel.create(createTaskDto);
  }

  async findAll(query: IQuery, req: IRequest): Promise<TResponse<TTask>> {
    const tasks = this.taskModel
      .find(
        {
          ...req.searchObj,
          ...req.dateQr,
        },
        { password: 0 },
      )
      .sort({ [query.sort]: query.orderBy === 'desc' ? -1 : 1 });

    const total = await tasks.clone().countDocuments();

    tasks.limit(+query.limit).skip(req.skip);

    const response: TResponse<TTask> = {
      result: await tasks.exec(),
      count: total,
      limit: +query.limit,
      page: +query.page,
    };

    return response;
  }

  async findOne(id: string): Promise<TTask> {
    const task = await this.taskModel.findById(id);

    if (!task) throw new BadRequestException('Task not found');

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<TTask> {
    await this.findOne(id);
    return await this.taskModel.findByIdAndUpdate(id, updateTaskDto, {
      new: true,
      runValidators: true,
    });
  }

  async remove(id: string): Promise<{ message: string }> {
    await this.findOne(id);

    await this.taskModel.findByIdAndDelete(id);

    return { message: `Task with id ${id} successfully deleted` };
  }
}
