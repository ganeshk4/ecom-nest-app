import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { USER } from '../entities';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      USER
    ]),
  ],
  controllers: [LoginController],
  providers: [LoginService],
})
export class LoginModule {}
