import { Body, Controller, Param, Post } from '@nestjs/common';
import { LoginPayload } from './dto/login.payload';
import { AuthService } from './auth.service';
import { RegisterPayload } from './dto/register.payload';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AcceptInvitePayload } from './dto/accept-invite.payload';

@Controller('auth')
@ApiTags('Auth')
@ApiBearerAuth()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() payload: LoginPayload) {
    return await this.authService.validateUser(payload);
  }

  @Post('register')
  async register(@Body() payload: RegisterPayload) {
    return await this.authService.register(payload);
  }

  @Post('register/invite')
  async registerWithInvite(@Body() payload: AcceptInvitePayload) {
    return await this.authService.registerWithInvite(payload);
  }
  @Post('/forgot-password')
  async forgotPassword(@Body() payload: { email: string }) {
    return await this.authService.forgotPassword(payload);
  }

  @Post('/reset-password/:id/:token')
  @ApiResponse({
    status: 200,
    description: 'Reset Password Request Received',
  })
  @ApiResponse({
    status: 400,
    description: 'Reset Password Request Failed',
  })
  async resetPassword(
    @Param('id') id: string,
    @Param('token') token: string,
    @Body() payload: { password: string },
  ) {
    return await this.authService.resetPassword(id, token, payload.password);
  }
}
