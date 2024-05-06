import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { TTask } from './models/task.model';
import { IQuery, IRequest, TResponse } from '../../common/helper/common-types';
import { UsersService } from '../users/users.service';
import { ProjectService } from '../project/project.service';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel('Task') private readonly taskModel: Model<TTask>,
    private readonly userService: UsersService,
    private readonly projectService: ProjectService,
  ) {}

  async create(createTaskDto: CreateTaskDto, req: IRequest): Promise<TTask> {
    const project = await this.projectService.findOne(createTaskDto.project);
    if (!project) throw new BadRequestException('Project not found');
    if (!(await this.userService.findOne(createTaskDto.assignee)))
      throw new BadRequestException('Assignee not found');

    const allTasks = await this.taskModel.find().countDocuments();
    // TODO: // check if project exist when creating a task
    return await this.taskModel.create({
      ...createTaskDto,
      reporter: req.user._id,
      slug: project.title.substring(0, 2) + allTasks,
    });
  }

  async findAll(
    query: IQuery,
    req: IRequest,
    projectId: string,
  ): Promise<TResponse<TTask>> {
    const tasks = this.taskModel
      .find(
        {
          ...req.searchObj,
          ...req.dateQr,
          project: projectId,
        },
        { password: 0 },
      )
      .populate(['assignee', 'reporter', 'project'])
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

  async taskStatus(projectId: string, req: IRequest) {
    const taskTypes = await this.taskModel.aggregate([
      {
        $match: {
          project: new mongoose.Types.ObjectId(projectId),
        },
      },

      {
        $match:
          req.query.start && req.query.end
            ? {
                startDate: {
                  $gte: new Date(req.query.start as string).toISOString(),
                  $lte: new Date(req.query.end as string).toISOString(),
                },
              }
            : { _id: { $exists: true } },
      },
      {
        $group: {
          _id: {
            type: '$type',
            // priority: '$priority',
          },

          count: { $sum: 1 },
        },
      },
    ]);

    const taskGroups = await this.taskModel.aggregate([
      {
        $match: {
          project: new mongoose.Types.ObjectId(projectId),
        },
      },

      {
        $match:
          req.query.start && req.query.end
            ? {
                startDate: {
                  $gte: new Date(req.query.start as string).toISOString(),
                  $lte: new Date(req.query.end as string).toISOString(),
                },
              }
            : { _id: { $exists: true } },
      },
      {
        $group: {
          _id: {
            group: '$group',
            // priority: '$priority',
          },

          count: { $sum: 1 },
        },
      },
    ]);

    const taskPriorties = await this.taskModel.aggregate([
      {
        $match: {
          project: new mongoose.Types.ObjectId(projectId),
        },
      },

      {
        $match:
          req.query.start && req.query.end
            ? {
                startDate: {
                  $gte: new Date(req.query.start as string).toISOString(),
                  $lte: new Date(req.query.end as string).toISOString(),
                },
              }
            : { _id: { $exists: true } },
      },
      {
        $group: {
          _id: {
            priority: '$priority',
            // priority: '$priority',
          },

          count: { $sum: 1 },
        },
      },
    ]);

    const employeeTasks = await this.taskModel.aggregate([
      {
        $match: {
          project: new mongoose.Types.ObjectId(projectId),
        },
      },

      {
        $match:
          req.query.start && req.query.end
            ? {
                startDate: {
                  $gte: new Date(req.query.start as string).toISOString(),
                  $lte: new Date(req.query.end as string).toISOString(),
                },
              }
            : { _id: { $exists: true } },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'assignee',
          foreignField: '_id',
          as: 'employee',
        },
      },

      { $unwind: '$employee' },
      {
        $group: {
          _id: '$employee.fullName',

          count: { $sum: 1 },
        },
      },
    ]);

    return {
      taskStatus: [...taskTypes, ...taskGroups, ...taskPriorties],
      employeeTasks,
    };
  }
}
