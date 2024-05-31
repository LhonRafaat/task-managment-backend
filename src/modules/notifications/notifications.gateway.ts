import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Server } from 'http';
import { IRequest } from '../../common/helper/common-types';
import { Req } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationsGateway {
  @WebSocketServer() server: Server;

  constructor(private readonly notificationsService: NotificationsService) {}

  @SubscribeMessage('createNotification')
  emitTaskNotification(
    @MessageBody() createNotificationDto: CreateNotificationDto,
  ) {
    console.log('here');
    this.server.emit('notification', createNotificationDto);
    console.log('here2');

    return this.notificationsService.create(createNotificationDto);
  }
}
