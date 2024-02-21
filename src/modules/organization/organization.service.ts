import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TOrganization } from './models/organization.model';
import { IQuery, IRequest, TResponse } from '../../common/helper/common-types';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectModel('Organization')
    private readonly organizationModel: Model<TOrganization>,
  ) {}
  async create(
    createOrganizationDto: CreateOrganizationDto & { owner: string },
  ): Promise<TOrganization> {
    return await this.organizationModel.create(createOrganizationDto);
  }

  async findAll(
    req: IRequest,
    query: IQuery,
  ): Promise<TResponse<TOrganization>> {
    const organization = this.organizationModel
      .find({
        ...req.searchObj,
        ...req.dateQr,
      })
      .sort({ [query.sort]: query.orderBy === 'desc' ? -1 : 1 });

    const total = await organization.clone().count();

    organization.limit(+query.limit).skip(req.skip);

    const response: TResponse<TOrganization> = {
      result: await organization.exec(),
      count: total,
      limit: +query.limit,
      page: +query.page,
    };

    return response;
  }

  async findOne(id: string): Promise<TOrganization> {
    const organization = await this.organizationModel.findById(id);

    if (!organization) throw new BadRequestException('Organization not found');

    return organization;
  }

  async findByTitle(title: string): Promise<TOrganization> {
    const organization = await this.organizationModel.findOne({ title });

    return organization;
  }

  async update(
    id: string,
    updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<TOrganization> {
    await this.findOne(id);

    return await this.organizationModel.findByIdAndUpdate(
      id,
      updateOrganizationDto,
      { new: true, runValidators: true },
    );
  }

  async remove(id: string): Promise<{ message: string }> {
    await this.findOne(id);

    return { message: `Organization with id ${id} deleted` };
  }
}
