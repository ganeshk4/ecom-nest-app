
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product, ProductCategory } from "./";
@Entity("PRODUCT_CATERGORY_MAPPING")
export class ProductCategoryMapping {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id: number;
  
  @Column({ name: 'CATEGORY_ID' })
  categoryId: number;

  @Column({ name: 'PRODUCT_ID' })
  productId: number;

//   @ManyToOne(() => Post, (post) => post.postToCategories)
//   public post!: Post

//   @ManyToOne(() => Category, (category) => category.postToCategories)
//   public category!: Category
// }
  // @ManyToOne(() => ProductCategory)
  // @JoinColumn({ name: "CATEGORY_ID", referencedColumnName: 'id' })
  // productCategory: ProductCategory;

  // @ManyToOne(() => Product)
  // @JoinColumn({ name: "PRODUCT_ID", referencedColumnName: 'id' })
  // product: Product;
}