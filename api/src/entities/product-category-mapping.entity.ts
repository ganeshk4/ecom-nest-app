
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity("PRODUCT_CATERGORY_MAPPING")
export class ProductCategoryMapping {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id: number;
  
  @Column({ name: 'CATEGORY_ID' })
  categoryId: number;

  @Column({ name: 'PRODUCT_ID' })
  productId: number;
}