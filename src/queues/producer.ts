import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { Channel } from 'amqplib';

@Injectable()
export class ProducerService {
  private channelWrapper: ChannelWrapper;
  constructor() {
    const connection = amqp.connect(['amqp://localhost']);
    this.channelWrapper = connection.createChannel({
      setup: (channel: Channel) => {
        return channel.assertQueue('botQueue', {
          durable: false,
        });
      },
    });
  }

  async addToBotQueue(data: any) {
    try {
      await this.channelWrapper.sendToQueue(
        'botQueue',
        Buffer.from(JSON.stringify(data)),
        {
          persistent: true,
        },
      );
      Logger.log('Sent To Queue');
    } catch (error) {
      throw new HttpException(
        'Error adding to queue',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
