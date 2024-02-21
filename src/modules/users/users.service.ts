import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TUser } from './user.model';
import { RegisterPayload } from '../auth/dto/register.payload';
import * as bcrypt from 'bcrypt';
import { IQuery, IRequest, TResponse } from '../../common/helper/common-types';
import { OrganizationService } from '../organization/organization.service';
import { TOrganization } from '../organization/models/organization.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<TUser>,
    private readonly organizationService: OrganizationService,
  ) {}

  async findAll(req: IRequest, query: IQuery): Promise<TResponse<TUser>> {
    const users = this.userModel
      .find({
        ...req.searchObj,
        ...req.dateQr,
      })
      .sort({ [query.sort]: query.orderBy === 'desc' ? -1 : 1 });

    const total = await users.clone().count();

    users.limit(+query.limit).skip(req.skip);

    const response: TResponse<TUser> = {
      result: await users.exec(),
      count: total,
      limit: +query.limit,
      page: +query.page,
    };

    return response;
  }

  async create(payload: RegisterPayload) {
    let organization: TOrganization | null = null;
    organization = await this.organizationService.findByTitle(
      payload.organization,
    );

    if (organization)
      throw new BadRequestException('Organization already exists');

    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(payload.password, saltOrRounds);

    const user = await this.userModel.create({
      ...payload,
      password: hashedPassword,
      organization: null,
    });

    organization = await this.organizationService.create({
      title: payload.organization,
      owner: user._id,
    });

    return await this.userModel.findByIdAndUpdate(
      user._id,
      {
        organization: organization._id,
      },
      {
        new: true,
        runValidators: true,
      },
    );
  }

  async findOne(id: string): Promise<TUser> {
    const user = await this.userModel.findById(id);
    if (!user) throw new BadRequestException('User not found');
    return user;
  }

  async findByEmail(email: string): Promise<TUser> {
    const user = await this.userModel.findOne({ email }).select('+password');
    if (!user) throw new BadRequestException('User not found');
    return user;
  }

  async remove(id: string): Promise<{ message: string }> {
    await this.findOne(id);
    await this.userModel.findByIdAndDelete(id);

    return { message: `User with id ${id} deleted` };
  }
}
