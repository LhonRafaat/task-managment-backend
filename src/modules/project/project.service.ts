import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectModel } from '@nestjs/mongoose';
import { IQuery, IRequest, TResponse } from '../../common/helper/common-types';
import { TProject } from './models/project.model';
import { Model } from 'mongoose';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel('Project') private readonly projectModel: Model<TProject>,
  ) {}
  create(createProjectDto: CreateProjectDto) {
    return 'This action adds a new project';
  }

  async findAll(query: IQuery, req: IRequest): Promise<TResponse<TProject>> {
    const projects = this.projectModel
      .find({
        ...req.searchObj,
        ...req.dateQr,
      })
      .sort({ [query.sort]: query.orderBy === 'desc' ? -1 : 1 });

    const total = await projects.clone().countDocuments();

    projects.limit(+query.limit).skip(req.skip);

    const response: TResponse<TProject> = {
      result: await projects.exec(),
      count: total,
      limit: +query.limit,
      page: +query.page,
    };

    return response;
  }

  async findOne(id: string): Promise<TProject> {
    const project = await this.projectModel.findById(id);

    if (!project) throw new BadRequestException('Project not found');

    return project;
  }

  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
  ): Promise<TProject> {
    await this.findOne(id);

    return await this.projectModel.findByIdAndUpdate(id, updateProjectDto, {
      new: true,
      runValidators: true,
    });
  }

  async remove(id: string): Promise<{ message: string }> {
    await this.findOne(id);
    return { message: `project with id ${id} deleted` };
  }
}
