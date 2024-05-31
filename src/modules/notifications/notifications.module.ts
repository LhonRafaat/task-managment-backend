import { Global, Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsGateway } from './notifications.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification } from './notification.schema';
import { NotificationsController } from './notifications.controller';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Notification', schema: Notification }]),
  ],
  providers: [NotificationsGateway, NotificationsService],
  exports: [NotificationsService, NotificationsGateway],
  controllers: [NotificationsController],
})
export class NotificationsModule {}
