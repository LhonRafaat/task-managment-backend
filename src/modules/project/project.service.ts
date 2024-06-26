import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectModel } from '@nestjs/mongoose';
import { IQuery, IRequest, TResponse } from '../../common/helper/common-types';
import { TProject } from './models/project.model';
import { Model } from 'mongoose';
import { OrganizationService } from '../organization/organization.service';
import { ProducerService } from '../../queues/producer';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel('Project') private readonly projectModel: Model<TProject>,
    private readonly organizationService: OrganizationService,
    private readonly ProducerService: ProducerService,
  ) {}
  async create(
    createProjectDto: CreateProjectDto,
    req: IRequest,
  ): Promise<TProject> {
    const count = await this.findAll(
      { ...req.query, limit: 100000 } as IQuery,
      req,
    );
    const created = await this.projectModel.create({
      ...createProjectDto,
      slug:
        createProjectDto.title.substring(0, 3).toUpperCase() +
        count.result.length +
        1,

      boardColumns: ['سەرەتا', 'لە کارکردندایە'],
    });

    await this.ProducerService.addToBotQueue({
      type: 'project',
      projectId: created._id,
      projectTitle: created.title,
    });

    return created;
  }

  async findAll(query: IQuery, req: IRequest): Promise<TResponse<TProject>> {
    const projects = this.projectModel
      .find({
        ...req.searchObj,
        ...req.dateQr,
      })
      .sort({ [query.sort]: query.orderBy === 'desc' ? -1 : 1 })
      .select('')
      .populate('leadUser', 'fullName _id'); // Populate leadUser with name and _id

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

  async findAllMe(query: IQuery, req: IRequest): Promise<TResponse<TProject>> {
    const projects = this.projectModel
      .find({
        ...req.searchObj,
        ...req.dateQr,
        members: req.user._id,
      })
      .sort({ [query.sort]: query.orderBy === 'desc' ? -1 : 1 })
      .select('')
      .populate('leadUser', 'fullName _id'); // Populate leadUser with name and _id

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
    const project = await this.projectModel.findById(id).populate('members');

    if (!project) throw new BadRequestException('Project not found');

    return project;
  }

  async findProjectsByOrganizationId(
    organizationId: string,
    req: IRequest,
  ): Promise<TProject[]> {
    const organization = await this.organizationService.findOne(organizationId);

    const isAdmin =
      req.user?._id?.toString() === organization.owner?.toString();
    if (isAdmin) {
      return this.projectModel
        .find({
          organization: organizationId,
        })
        .populate(['members', 'leadUser'])
        .exec();
    } else {
      return this.projectModel
        .find({
          organization: organizationId,
          members: { $in: [req.user._id] },
        })
        .populate('leadUser', 'fullName _id')
        .exec();
    }
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

  async addMembers(
    id: string,
    updateProjectDto: { members: string[] },
  ): Promise<TProject> {
    await this.findOne(id);

    return await this.projectModel.findByIdAndUpdate(
      id,
      { $push: { members: updateProjectDto.members } },
      {
        new: true,
        runValidators: true,
      },
    );
  }

  async removeMembers(
    id: string,
    updateProjectDto: { members: string[] },
  ): Promise<TProject> {
    await this.findOne(id);

    return await this.projectModel.findByIdAndUpdate(
      id,
      { $pullAll: { members: updateProjectDto.members } },
      {
        new: true,
        runValidators: true,
      },
    );
  }

  async remove(id: string): Promise<{ message: string }> {
    await this.projectModel.findByIdAndDelete(id);
    return { message: `project with id ${id} deleted` };
  }
}
