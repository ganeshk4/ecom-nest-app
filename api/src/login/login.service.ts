import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { TriggerOtpDto, VerifyOtpDto } from './dto/login.dto';

@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(User)
    private readonly user: Repository<User>,
  ) {}

  async createLogin(session: Record<string, any>, data: TriggerOtpDto) {
    const { mobile } = data;
    session.mobile = mobile;
    session.otp = 1006;
    session.save();
    return { isSuccess: true };
  }

  async verifyOtp(session: Record<string, any>, body: VerifyOtpDto) {
    let valid = false;
    let user;
    if (session.otp === Number(body.otp)) {
      user = await this.user.findOne({ where: { mobile: session.mobile } });
      if (user) {
        session.user = user;
        session.userId = user.id;
        if (!user.otpVerified) {
          await this.user.update({ id: user.id }, { otpVerified: true });
        }
        valid = true;
      }
    }
    return { isSuccess: valid, user };
  }

  async getUser(session: Record<string, any>) {
    console.log("getUser");
    console.log(session.user);
    return { isSuccess: true, user: session.user };
  }
}
