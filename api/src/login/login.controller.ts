import { Body, Controller, Get, Post, Session, UseGuards, ValidationPipe } from '@nestjs/common';
import { CustomerAuthGuard } from '../guards/customer.guard';
import { SecretAuthGuard } from '../guards/secret.guard';
import { TriggerOtpDto, VerifyOtpDto } from './dto/login.dto';
import { LoginService } from './login.service';

@Controller()
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @UseGuards(SecretAuthGuard)
  @Post('login')
  async login(
    @Session() session: Record<string, any>,
    @Body(ValidationPipe) body: TriggerOtpDto,
  ) {
    return await this.loginService.createLogin(session, body);
  }

  @UseGuards(SecretAuthGuard)
  @Post('verifyOtp')
  async verifyOtp(
    @Session() session: Record<string, any>,
    @Body(ValidationPipe) body: VerifyOtpDto,
  ) {
    return await this.loginService.verifyOtp(session, body);
  }

  @UseGuards(CustomerAuthGuard)
  @Get('userInfo')
  async userInfo(@Session() session: Record<string, any>) {
    return await this.loginService.getUser(session);
  }
}
