import { Body, Controller, Get, Post, Session, ValidationPipe } from '@nestjs/common';
import { TriggerOtpDto, VerifyOtpDto } from './dto/login.dto';
import { LoginService } from './login.service';

@Controller()
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post('login')
  async login(
    @Session() session: Record<string, any>,
    @Body(ValidationPipe) body: TriggerOtpDto) {
    return await this.loginService.createLogin(session, body);
  }

  @Post('verifyOtp')
  async verifyOtp(
    @Session() session: Record<string, any>,
    @Body(ValidationPipe) body: VerifyOtpDto) {
    return await this.loginService.verifyOtp(session, body);
  }
}
