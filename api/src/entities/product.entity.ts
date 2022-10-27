import { ProductCategory, ProductAvailability } from './';
import { Column, Entity, JoinColumn, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn, JoinTable } from "typeorm";
@Entity("PRODUCT")
export class Product {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id: number;

  @Column({ name: 'NAME' })
  name: string;

  @Column({ name: 'DISPLAY_ID' })
  displayId: number;

  @Column({ name: 'PRICE' })
  price: number;

  @Column({ name: 'DISPLAY_PRICE' })
  displayPrice: number;

  @Column({ name: 'DISCOUNT' })
  discount: number;

  @Column({ name: 'RATINGS' })
  ratings: number;

  @Column({ name: 'IMAGE_URL' })
  imageUrl: number;

  @Column({ name: 'DESCRIPTION', type: 'json' })
  description: string[];

  @Column({ name: 'CREATED_AT', type: 'timestamp' })
  createdAt: Date;

  @Column({ name: 'MODIFIED_AT', type: 'timestamp' })
  modifiedAt: Date;

  @ManyToMany(() => ProductCategory, category => category.products)
  @JoinTable({
    name: "PRODUCT_CATERGORY_MAPPING", // table name for the junction table of this relation
    joinColumn: {
        name: "PRODUCT_ID",
        referencedColumnName: "id"
    },
    inverseJoinColumn: {
        name: "CATEGORY_ID",
        referencedColumnName: "id"
    }
  })
  categories: ProductCategory[];

  @OneToOne(() => ProductAvailability)
  @JoinColumn({ name: "ID", referencedColumnName: "productId" })
  availablity: ProductAvailability


  // @OneToMany(() => ProductCategoryMapping, (pcm) => pcm.product)
  // categories: ProductCategoryMapping[];
}