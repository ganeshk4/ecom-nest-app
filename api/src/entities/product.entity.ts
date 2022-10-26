import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
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

  // @ManyToOne(() => ProductCategoryType)
  // @JoinColumn({ name: "CATEGORY_TYPE", referencedColumnName: 'id' })
  // categoryType: ProductCategoryType;
}