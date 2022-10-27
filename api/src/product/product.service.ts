import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product, ProductCategoryMapping } from '../entities';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly product: Repository<Product>,
    @InjectRepository(ProductCategoryMapping)
    private readonly productCategoryMapping: Repository<ProductCategoryMapping>,
  ) {
  } 

  async getList(search?) {
    //console.log(search);
    let products;
    if (search && Object.keys(search).length) {
      const categoryTypes = Object.keys(search);
      const categories = [];
      for (let categoryType of categoryTypes) {
        categories.push(...Object.keys(search[categoryType]));
      }
      
      const q = this.product.createQueryBuilder("p")
      .innerJoinAndSelect("p.categories", "pc")
      .innerJoinAndSelect("p.availablity", "pa")
      .innerJoinAndSelect("pc.categoryType", "pct")
      .andWhere("pc.id in (:categories)", {categories});

      products = await q.getMany();

      if (categoryTypes.length > 1) {
        for (const product of products) {
          //console.log(product);
          let pass = false;
          for (const catType of categoryTypes) {
            const categoriesOfType = Object.keys(search[catType]).map(key => parseInt(key));
            const productCategories = product.categories.map( cat => cat.id);
            pass = false;

            for (const prodCategory of productCategories) {
              if (categoriesOfType.indexOf(prodCategory) > -1) {
                pass = true;
              }
            }
            // console.log("pass");
            // console.log(pass);
            if (!pass) {
              break;
            }
          }
          if (!pass) {
            product.rejected = true;
          }
        }
      }

    } else {
      products = await this.product.createQueryBuilder("p")
      .innerJoinAndSelect("p.availablity", "pa")
      .getMany();
      
    }
    products = products.filter(prod => !prod.rejected);

    //console.log(products);
    return { isSuccess: true, products };
  }
}
