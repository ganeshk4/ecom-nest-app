import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductCategory, ProductCategoryType } from '../entities';
import { createQueryBuilder, Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(ProductCategoryType)
    private readonly categoryType: Repository<ProductCategoryType>,
  ) {}

  async getAllCategories() {
    // const categories = await this.category.createQueryBuilder("c")
    // .leftJoinAndSelect("c.categoryType", "ct") 
    // .getMany();

    const categoryTypes = await this.categoryType.createQueryBuilder("ct")
    .leftJoinAndSelect("ct.categories", "cta") 
    .getMany();

    return { isSuccess: true, categoryTypes };
  }
}
