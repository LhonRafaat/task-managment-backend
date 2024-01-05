import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IQuery, IRequest } from '../../common/helper/common-types';
import { AuthGuard } from '@nestjs/passport';

@Controller('organization')
@ApiTags('Organization')
@ApiBearerAuth()
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(
    @Body() createOrganizationDto: CreateOrganizationDto,
    @Req() req: IRequest,
  ) {
    return this.organizationService.create({
      ...createOrganizationDto,
      owner: req.user._id,
    });
  }

  @Get()
  findAll(@Req() req: IRequest, @Query() query: IQuery) {
    return this.organizationService.findAll(req, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.organizationService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ) {
    return this.organizationService.update(id, updateOrganizationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.organizationService.remove(id);
  }
}
