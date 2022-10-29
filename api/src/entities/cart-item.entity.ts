import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User, Cart, Product } from "./";
@Entity("CART_ITEM")
export class CartItem {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id: number;

  @Column({ name: 'CART_ID' })
  cartId: number;

  @Column({ name: 'USER_ID' })
  userId: number;

  @Column({ name: 'PRODUCT_ID' })
  productId: number;

  @Column({ name: 'SELLING_PRICE_AT' })
  sellingPriceAT: number;

  @Column({ name: 'TAX_AMOUNT' })
  taxAmount: number;

  @Column({ name: 'TAX_PERCENT' })
  taxPercent: number;

  @Column({ name: 'SELLING_PRICE_BT' })
  sellingPriceBT: number;

  @Column({ name: 'DISPLAY_PRICE' })
  displayPrice: number;

  @Column({ name: 'QTY' })
  qty: number;

  @Column({ name: 'IMAGE_URL' })
  imageUrl: string;

  @Column({ name: 'DESCRIPTION', type: 'json' })
  description: string[];

  @Column({ name: 'CREATED_AT', type: 'timestamp' })
  createdAt: Date;

  @Column({ name: 'MODIFIED_AT', type: 'timestamp' })
  modifiedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: "USER_ID", referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => Cart)
  @JoinColumn({ name: "CART_ID", referencedColumnName: 'id' })
  cart: Cart;

  @ManyToOne(() => Product)
  @JoinColumn({ name: "PRODUCT_ID", referencedColumnName: 'id' })
  product: Product;
}