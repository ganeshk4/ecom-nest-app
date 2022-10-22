import { IsString, Length } from "class-validator";

export class TriggerOtpDto {
  @IsString()
  @Length(10, 10)
  mobile: string;
}

export class VerifyOtpDto {
  @IsString()
  @Length(4,4)
  otp: string;
}