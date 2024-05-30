import {
  Controller,
  Get,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  Patch,
  Body,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TUser } from './user.model';
import { AuthGuard } from '@nestjs/passport';
import {
  Action,
  IQuery,
  IRequest,
  TResponse,
  getResponseType,
} from '../../common/helper/common-types';
import { QueryTypes } from '../../common/decorators/query.decorator';
import { checkAbilities } from '../../common/decorators/abilities.decorator';
import { AbilitiesGuard } from '../../common/guards/abilities.guard';

@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
@ApiExtraModels(TUser) // this decorator helps us to resolve TUser class when used in getResponseType function
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOkResponse(getResponseType(TUser))
  @QueryTypes()
  @UseGuards(AuthGuard('jwt'), AbilitiesGuard)
  @checkAbilities({ action: Action.Read, subject: TUser })
  async findAll(
    @Req() req: IRequest,
    @Query() query: IQuery,
  ): Promise<TResponse<TUser>> {
    return this.usersService.findAll(req, query);
  }

  @Get('/my-organization/:organizationId')
  @ApiOkResponse(getResponseType(TUser))
  @QueryTypes()
  @UseGuards(AuthGuard('jwt'))
  async findMyOrganizationUsers(
    @Req() req: IRequest,
    @Query() query: IQuery,
    @Param('organizationId') organizationId: string,
  ): Promise<TResponse<TUser>> {
    return this.usersService.findMyOrganizationUsers(
      req,
      query,
      organizationId,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({ type: TUser })
  @Get('me')
  getMe(@Req() req: IRequest): TUser {
    return req.user;
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({ type: TUser })
  @Post('check-is-owner/:organizationId')
  checkIsOwner(
    @Req() req: IRequest,
    @Param('organizationId') organizationId: string,
  ): Promise<{ isOwner: boolean }> {
    return this.usersService.checkIsOwner(req, organizationId);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({ type: TUser })
  findOne(@Param('id') id: string): Promise<TUser> {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: TUser })
  @UseGuards(AuthGuard('jwt'), AbilitiesGuard)
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: Partial<TUser>,
  ): Promise<TUser> {
    return this.usersService.update(id, updateUserDto);
  }

  @Patch('/remove-from-organization/:id')
  @ApiOkResponse({ type: TUser })
  @UseGuards(AuthGuard('jwt'), AbilitiesGuard)
  async removeFromOrganization(
    @Param('id') id: string,
    @Body() updateUserDto: { organizationId: string },
  ): Promise<TUser> {
    return this.usersService.removeFromOrganization(id, updateUserDto);
  }

  @Patch('change-password/:id')
  @ApiOkResponse({ type: TUser })
  @UseGuards(AuthGuard('jwt'), AbilitiesGuard)
  async changePassword(
    @Param('id') id: string,
    @Body() data: { currentPassword: string; newPassword: string },
  ): Promise<TUser> {
    return this.usersService.changePassword(
      id,
      data.currentPassword,
      data.newPassword,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), AbilitiesGuard)
  @checkAbilities({ action: Action.Delete, subject: TUser })
  remove(@Param('id') id: string) {
    console.log('id', id);

    return this.usersService.remove(id);
  }
}
