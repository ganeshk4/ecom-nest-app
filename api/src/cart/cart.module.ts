import { Cart, CartItem, Product, ProductAvailability } from '../entities';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      Cart,
      CartItem,
      ProductAvailability
    ]),
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
