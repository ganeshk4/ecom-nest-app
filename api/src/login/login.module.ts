import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { Module } from '@nestjs/common';


@Module({
  imports: [],
  controllers: [LoginController],
  providers: [LoginService],
})
export class LoginModule {}
