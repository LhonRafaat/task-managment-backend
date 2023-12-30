import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Project } from './project.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Project', schema: Project }])],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
