import { ProductCategoryType } from './';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
@Entity("PRODUCT_CATEGORY")
export class ProductCategory {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id: number;

  @Column({ name: 'CATEGORY' })
  category: string;

  @Column({ name: 'CATEGORY_TYPE' })
  categoryTypeId: number;

  @Column({ name: 'CREATED_AT', type: 'timestamp' })
  createdAt: Date;

  @Column({ name: 'MODIFIED_AT', type: 'timestamp' })
  modifiedAt: Date;

  @ManyToOne(() => ProductCategoryType)
  @JoinColumn({ name: "CATEGORY_TYPE", referencedColumnName: 'id' })
  categoryType: ProductCategoryType;
}