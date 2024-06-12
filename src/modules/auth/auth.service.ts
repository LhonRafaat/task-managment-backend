import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginPayload } from './dto/login.payload';
import { RegisterPayload } from './dto/register.payload';
import { JwtService } from '@nestjs/jwt';
import { AcceptInvitePayload } from './dto/accept-invite.payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(payload: LoginPayload): Promise<any> {
    const user = await this.usersService.findByEmail(payload.email);
    if (user) {
      const isMatch = await bcrypt.compare(payload.password, user.password);
      if (isMatch) {
        const payload = { id: user._id, fullName: user.fullName };
        return { token: this.jwtService.sign(payload) };
      }
    }
    throw new UnauthorizedException(
      'Could not authenticate. Please try again.',
    );
  }

  async register(payload: RegisterPayload) {
    return await this.usersService.create(payload);
  }

  async registerWithInvite(payload: AcceptInvitePayload) {
    return await this.usersService.joinOrganization(payload);
  }

  async forgotPassword(payload: { email: string }) {
    return await this.usersService.forgotPassword(payload);
  }

  async resetPassword(id, token, password) {
    return await this.usersService.resetPassword(id, token, password);
  }
}
