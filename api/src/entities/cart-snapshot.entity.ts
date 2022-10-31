import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User, CartSnapshotItem } from ".";
@Entity("CART_SNAPSHOT")
export class CartSnapshot {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id: number;

  @Column({ name: 'USER_ID' })
  userId: number;

  @Column({ name: 'ORDER_ID' })
  orderId: number;

  @Column({ name: 'STATUS' })
  status: 'VERIFICATION_PENDING' | 'VERIFIED';

  @Column({ name: 'PAYABLE_AMOUNT' })
  payableAmount: number;

  @Column({ name: 'PAID_AMOUNT' })
  paidAmount: number;

  @Column({ name: 'TOTAL_TAX_AMOUNT' })
  totalTaxAmount: number;

  @Column({ name: 'TOTAL_SELLING_PRICE_BT' })
  totalSellingPriceBT: number;

  @Column({ name: 'RZ_PAYMENT_ID' })
  razorpay_payment_id: string;

  @Column({ name: 'RZ_ORDER_ID' })
  razorpay_order_id: string;

  @Column({ name: 'RZ_SIGNATURE' })
  razorpay_signature: string;

  @Column({ name: 'FROM_WEBHOOK' })
  fromWebhook: boolean;

  @Column({ name: 'RZ_RESPONSE', type: 'json' })
  razorpay_response: any;

  @Column({ name: 'CREATED_AT', type: 'timestamp' })
  createdAt: Date;

  @Column({ name: 'MODIFIED_AT', type: 'timestamp' })
  modifiedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: "USER_ID", referencedColumnName: 'id' })
  user: User;

  @OneToMany(()=> CartSnapshotItem, (item) => item.cartSnapshot)
  cartItems: CartSnapshotItem
}