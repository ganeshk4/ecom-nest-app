import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User, OrderItem } from ".";
@Entity("EC_ORDER")
export class Order {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id: number;

  @Column({ name: 'USER_ID' })
  userId: number;

  @Column({ name: 'CART_SN_ID' })
  cartSnId: number;

  @Column({ name: 'STATUS' })
  status: 'PLACED' | 'QUEUED' | 'COMPLETED';

  @Column({ name: 'PAYABLE_AMOUNT' })
  payableAmount: number;

  @Column({ name: 'PAID_AMOUNT' })
  paidAmount: number;

  @Column({ name: 'TOTAL_TAX_AMOUNT' })
  totalTaxAmount: number;

  @Column({ name: 'TOTAL_SELLING_PRICE_BT' })
  totalSellingPriceBT: number;

  @Column({ name: 'CREATED_AT', type: 'timestamp' })
  createdAt: Date;

  @Column({ name: 'MODIFIED_AT', type: 'timestamp' })
  modifiedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: "USER_ID", referencedColumnName: 'id' })
  user: User;

  @OneToMany(()=> OrderItem, (item) => item.order)
  orderItems: OrderItem
}