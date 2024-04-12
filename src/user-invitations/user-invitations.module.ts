import { Module } from '@nestjs/common';
import { UserInvitationsService } from './user-invitations.service';
import { UserInvitationsController } from './user-invitations.controller';

@Module({
  controllers: [UserInvitationsController],
  providers: [UserInvitationsService]
})
export class UserInvitationsModule {}
