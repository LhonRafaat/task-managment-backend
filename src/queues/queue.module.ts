import { Global, Module } from '@nestjs/common';
import { ProducerService } from './producer';

@Global()
@Module({
  providers: [ProducerService],
  exports: [ProducerService],
})
export class QueueModule {}
