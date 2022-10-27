
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./";
@Entity("PRODUCT_AVAILABILITY")
export class ProductAvailability {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id: number;

  @Column({ name: 'PRODUCT_ID' })
  productId: number;

  @Column({ name: 'QTY' })
  availableQty: number;

  @Column({ name: 'CREATED_AT', type: 'timestamp' })
  createdAt: Date;

  @Column({ name: 'MODIFIED_AT', type: 'timestamp' })
  modifiedAt: Date;
}