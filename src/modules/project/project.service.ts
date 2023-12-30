import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectModel } from '@nestjs/mongoose';
import { IQuery, IRequest, TResponse } from '../../common/helper/common-types';
import { TProject } from './models/project.model';

@Injectable()
export class ProjectService {
  constructor(@InjectModel('Project') private readonly projectModel) {}
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

  findOne(id: number) {
    return `This action returns a #${id} project`;
  }

  update(id: number, updateProjectDto: UpdateProjectDto) {
    return `This action updates a #${id} project`;
  }

  remove(id: number) {
    return `This action removes a #${id} project`;
  }
}
