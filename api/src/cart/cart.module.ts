import { Cart, CartItem, Product, ProductAvailability, CartSnapshotItem, CartSnapshot } from '../entities';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentModule } from '../payment/payment.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      Cart,
      CartItem,
      ProductAvailability,
      CartSnapshot,
      CartSnapshotItem
    ]),
    PaymentModule
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
