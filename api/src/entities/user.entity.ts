
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
//import { SkinnsiOrder, SkinnsiOrderItems, ToothsiAdminUser } from '.';
@Entity("USER")
export class USER {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id: number;

  @Column({ name: 'FIRST_NAME' })
  firstName: string;

  @Column({ name: 'LAST_NAME' })
  lastName: string;

  @Column({ name: 'MOBILE' })
  mobile: string;

  @Column({ name: 'OTP_VERIFIED' })
  otpVerified: boolean;

  @Column({ name: 'CREATED_AT', type: 'timestamp' })
  createAt: Date;

  @Column({ name: 'MODIFIED_AT', type: 'timestamp' })
  modifiedAt: Date;

  // @ManyToOne(() => SkinnsiOrder)
  // @JoinColumn({ name: "ORDER_ID", referencedColumnName: 'id' })
  // order: SkinnsiOrder;

  // @OneToOne(() => SkinnsiOrderItems)
  // @JoinColumn({ name: "ORDER_ITEM_ID", referencedColumnName: 'id' })
  // orderItem: SkinnsiOrderItems;
}