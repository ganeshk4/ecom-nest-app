import { 
  Cart,
  CartItem,
  Product,
  ProductAvailability,
  CartSnapshotItem,
  CartSnapshot,
  Order,
  OrderItem 
} from '../entities';
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
      CartSnapshotItem,
      Order,
      OrderItem
    ]),
    PaymentModule
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
