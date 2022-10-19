import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { USER } from '../entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LoginService {
  constructor(
  @InjectRepository(USER)
  private readonly user: Repository<USER>,
  ) {}

  async createLogin(session) {
    const user = await this.user.findOne({ where: { mobile: '9920566922' }});
    console.log(user);
    session.otp = 1006;
    session.save();
    return {isSuccess: true};
  }

  verifyOtp(session, body) {
    console.log(session);
    if (session.otp === Number(body.otp)) {
      return {isSuccess: true};
    }
    return {isSuccess: false};
  }
}
