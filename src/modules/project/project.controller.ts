import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import {
  IQuery,
  IRequest,
  getResponseType,
} from '../../common/helper/common-types';
import { TProject } from './models/project.model';

@Controller('project')
@ApiTags('Project')
@ApiBearerAuth()
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @ApiOkResponse({
    type: TProject,
  })
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createProjectDto: CreateProjectDto, @Req() req: IRequest) {
    return this.projectService.create(createProjectDto, req);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse(getResponseType(TProject))
  findAll(@Req() req: IRequest, @Query() query: IQuery) {
    return this.projectService.findAll(query, req);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse(getResponseType(TProject))
  findAllMe(@Req() req: IRequest, @Query() query: IQuery) {
    return this.projectService.findAllMe(query, req);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse(getResponseType(TProject))
  findOne(@Param('id') id: string) {
    return this.projectService.findOne(id);
  }

  @Get('organization/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({ type: [TProject] })
  async findProjectsByOrganizationId(
    @Param('id') organizationId: string,
    @Req() req: IRequest,
  ): Promise<TProject[]> {
    return this.projectService.findProjectsByOrganizationId(
      organizationId,
      req,
    );
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse(getResponseType(TProject))
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectService.update(id, updateProjectDto);
  }

  @Patch('/add-members/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse(getResponseType(TProject))
  addMembers(
    @Param('id') id: string,
    @Body() updateProjectDto: { members: string[] },
  ) {
    return this.projectService.addMembers(id, updateProjectDto);
  }

  @Patch('/remove-members/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse(getResponseType(TProject))
  removeMembers(
    @Param('id') id: string,
    @Body() updateProjectDto: { members: string[] },
  ) {
    return this.projectService.removeMembers(id, updateProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectService.remove(id);
  }
}
