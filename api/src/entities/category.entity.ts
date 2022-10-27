import { ProductCategoryType, Product } from './';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, JoinTable, ManyToMany } from "typeorm";
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

  @ManyToMany(() => Product, product => product.categories)
  @JoinTable({
    name: "PRODUCT_CATERGORY_MAPPING", // table name for the junction table of this relation
    joinColumn: {
        name: "CATEGORY_ID",
        referencedColumnName: "id"
    },
    inverseJoinColumn: {
        name: "PRODUCT_ID",
        referencedColumnName: "id"
    }
  })
  products: Product[]
}