import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User, CartSnapshot, Product } from ".";
@Entity("CART_SNAPSHOT_ITEM")
export class CartSnapshotItem {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id: number;

  @Column({ name: 'CART_SN_ID' })
  cartSnId: number;

  @Column({ name: 'USER_ID' })
  userId: number;

  @Column({ name: 'PRODUCT_ID' })
  productId: number;

  @Column({ name: 'NAME' })
  name: string;

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

  @ManyToOne(() => CartSnapshot)
  @JoinColumn({ name: "CART_SN_ID", referencedColumnName: 'id' })
  cartSnapshot: CartSnapshot;

  @ManyToOne(() => Product)
  @JoinColumn({ name: "PRODUCT_ID", referencedColumnName: 'id' })
  product: Product;
}