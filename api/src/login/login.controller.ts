import { Body, Controller, Get, Post, Session } from '@nestjs/common';
import { LoginService } from './login.service';

@Controller()
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post('login')
  async login(@Session() session, ) {
    await this.loginService.createLogin(session);
  }

  @Post('verifyOtp')
  async verifyOtp(@Session() session, @Body() body) {
    return await this.loginService.verifyOtp(session, body);
  }
}
