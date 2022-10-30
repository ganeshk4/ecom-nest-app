import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User, CartItem } from "./";
@Entity("CART")
export class Cart {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id: number;

  @Column({ name: 'USER_ID' })
  userId: number;

  @Column({ name: 'STATUS' })
  status: 'ACTIVE';

  @Column({ name: 'PAYABLE_AMOUNT' })
  payableAmount: number;

  @Column({ name: 'CREATED_AT', type: 'timestamp' })
  createdAt: Date;

  @Column({ name: 'MODIFIED_AT', type: 'timestamp' })
  modifiedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: "USER_ID", referencedColumnName: 'id' })
  user: User;

  @OneToMany(()=> CartItem, (item) => item.cart)
  cartItems: CartItem
}