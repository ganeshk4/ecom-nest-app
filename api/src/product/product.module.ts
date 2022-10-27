import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product, ProductCategoryMapping } from '../entities';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductCategoryMapping
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
