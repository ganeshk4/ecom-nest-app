import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductCategory, ProductCategoryType } from '../entities';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductCategory,
      ProductCategoryType
    ]),
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
