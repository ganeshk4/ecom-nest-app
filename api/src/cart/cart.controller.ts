import { Body, Controller, Post, Session, UseGuards } from '@nestjs/common';
import { CustomerAuthGuard } from '../guards/customer.guard';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(CustomerAuthGuard)
  @Post('add')
  async addToCart(
    @Session() session: Record<string, any>,
    @Body() options: AddToCartDto
  ) {
    return await this.cartService.addToCart(options, session);
  }
}
