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
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  IQuery,
  IRequest,
  getResponseType,
} from '../../common/helper/common-types';
import { AuthGuard } from '@nestjs/passport';
import { TOrganization } from './models/organization.model';
import { QueryTypes } from '../../common/decorators/query.decorator';

@Controller('organization')
@ApiTags('Organization')
@ApiBearerAuth()
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({
    type: TOrganization,
  })
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
  @ApiOkResponse(getResponseType(TOrganization))
  @QueryTypes()
  findAll(@Req() req: IRequest, @Query() query: IQuery) {
    return this.organizationService.findAll(req, query);
  }

  @Get(':id')
  @ApiOkResponse({
    type: TOrganization,
  })
  findOne(@Param('id') id: string) {
    return this.organizationService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({
    type: TOrganization,
  })
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
