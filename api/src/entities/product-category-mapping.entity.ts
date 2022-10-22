
import { Column, Entity } from "typeorm";
@Entity("PRODUCT_CATERGORY_MAPPING")
export class ProductCategoryMapping {
  @Column({ name: 'CATEGORY_ID' })
  categoryId: number;

  @Column({ name: 'PRODUCT_ID' })
  productId: number;
}