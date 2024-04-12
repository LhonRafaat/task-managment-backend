import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Task } from './task.schema';
import { UsersModule } from '../users/users.module';
import { ProjectModule } from '../project/project.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Task', schema: Task }]),
    UsersModule,
    ProjectModule,
  ],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
