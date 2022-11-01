
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity("USER")
export class User {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id: number;

  @Column({ name: 'FIRST_NAME' })
  firstName: string;

  @Column({ name: 'LAST_NAME' })
  lastName: string;

  @Column({ name: 'MOBILE' })
  mobile: string;

  @Column({ name: 'EMAIL' })
  email: string;

  @Column({ name: 'OTP_VERIFIED' })
  otpVerified: boolean;

  @Column({ name: 'CREATED_AT', type: 'timestamp' })
  createdAt: Date;

  @Column({ name: 'MODIFIED_AT', type: 'timestamp' })
  modifiedAt: Date;
}