import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { USER } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { TriggerOtpDto, VerifyOtpDto } from './dto/login.dto';

@Injectable()
export class LoginService {
  constructor(
  @InjectRepository(USER)
  private readonly user: Repository<USER>,
  ) {}

  async createLogin(session: Record<string, any>, data: TriggerOtpDto) {
    const { mobile } = data;
    session.mobile = mobile;
    session.otp = 1006;
    session.save();
    return {isSuccess: true};
  }

  async verifyOtp(session: Record<string, any>, body: VerifyOtpDto) {
    let valid = false;
    if (session.otp === Number(body.otp)) {
      const user = await this.user.findOne({ where: { mobile: session.mobile }});
      if (user) {
        if (!user.otpVerified) {
          await this.user.update({id: user.id}, { otpVerified: true });
        }
        valid = true;
      }
    }
    return {isSuccess: valid};
  }
}
