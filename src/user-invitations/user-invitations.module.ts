import { Module, forwardRef } from '@nestjs/common';
import { UserInvitationsService } from './user-invitations.service';
import { UserInvitationsController } from './user-invitations.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserInvitation } from './user-invitation.schema';
import { OrganizationModule } from '../modules/organization/organization.module';
import { UsersModule } from '../modules/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'UserInvitation', schema: UserInvitation },
    ]),
    OrganizationModule,
    forwardRef(() => UsersModule),
  ],
  controllers: [UserInvitationsController],
  providers: [UserInvitationsService],
  exports: [UserInvitationsService],
})
export class UserInvitationsModule {}
