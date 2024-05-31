import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { InjectModel } from '@nestjs/mongoose';
import { IRequest } from '../../common/helper/common-types';
import { Model } from 'mongoose';
import { TNotification } from './notification.type';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel('Notification')
    private notificationModel: Model<TNotification>,
  ) {}
  async create(createNotificationDto: CreateNotificationDto) {
    return await this.notificationModel.create(createNotificationDto);
  }

  async findAll(req: IRequest) {
    return await this.notificationModel
      .find({ userId: req.user._id })
      .populate(['projectId', 'taskId']);
  }
}
