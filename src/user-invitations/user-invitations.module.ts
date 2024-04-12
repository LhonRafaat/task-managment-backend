import { Module } from '@nestjs/common';
import { UserInvitationsService } from './user-invitations.service';
import { UserInvitationsController } from './user-invitations.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserInvitation } from './user-invitation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'UserInvitation', schema: UserInvitation },
    ]),
  ],
  controllers: [UserInvitationsController],
  providers: [UserInvitationsService],
})
export class UserInvitationsModule {}
