import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { USER } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LoginService {
  constructor(@InjectRepository(USER)
  private readonly user: Repository<USER>,) {}

  createLogin(session) {
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
