
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity("PRODUCT_CATEGORY_TYPE")
export class ProductCategoryType {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id: number;

  @Column({ name: 'TYPE' })
  type: string;

  @Column({ name: 'CREATED_AT', type: 'timestamp' })
  createdAt: Date;

  @Column({ name: 'MODIFIED_AT', type: 'timestamp' })
  modifiedAt: Date;
}