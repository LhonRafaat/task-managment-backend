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
  create(createOrganizationDto: CreateOrganizationDto) {
    return 'This action adds a new organization';
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

  update(id: string, updateOrganizationDto: UpdateOrganizationDto) {
    return `This action updates a #${id} organization`;
  }

  remove(id: string) {
    return `This action removes a #${id} organization`;
  }
}
