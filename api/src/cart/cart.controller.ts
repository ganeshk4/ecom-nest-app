import { Body, Controller, Get, Post, Session, UseGuards, ValidationPipe } from '@nestjs/common';
import { CustomerAuthGuard } from '../guards/customer.guard';
import { CartService } from './cart.service';
import { AddToCartDto, RzpResponse } from './dto/cart.dto';

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

  @UseGuards(CustomerAuthGuard)
  @Get('details')
  async details(
    @Session() session: Record<string, any>
  ) {
    return await this.cartService.getCartDetails(session);
  }

  @UseGuards(CustomerAuthGuard)
  @Get('startcheckout')
  async startcheckout(
    @Session() session: Record<string, any>
  ) {
    return await this.cartService.getOrderLink(session);
  }

  @UseGuards(CustomerAuthGuard)
  @Post('verifyPayment')
  async verify(
    @Body(ValidationPipe) options: RzpResponse,
    @Session() session: Record<string, any>
  ) {
    return await this.cartService.verifyOrder(session, options);
  }
}
