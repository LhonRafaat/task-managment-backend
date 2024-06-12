import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { IRequest } from '../../common/helper/common-types';
import { NotificationsService } from './notifications.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('')
  findAll(@Req() req: IRequest) {
    return this.notificationsService.findAll(req);
  }
}
