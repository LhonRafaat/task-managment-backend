import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User } from './user.schema';
import { OrganizationService } from '../organization/organization.service';
import { OrganizationModule } from '../organization/organization.module';
import { UserInvitationsModule } from '../../user-invitations/user-invitations.module';
import { Token } from '../tokens/token.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: User },
      { name: 'Token', schema: Token },
    ]),
    OrganizationModule,
    UserInvitationsModule,
  ],

  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
