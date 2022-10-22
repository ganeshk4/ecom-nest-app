import { Controller, Get, Session, UseGuards } from '@nestjs/common';
import { CustomerAuthGuard } from '../guards/customer.guard';
import { ProductService } from './product.service';

@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(CustomerAuthGuard)
  @Get('userInfo')
  async userInfo(@Session() session: Record<string, any>) {
    return await this.productService.getUser(session);
  }
}
