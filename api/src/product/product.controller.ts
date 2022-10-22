import { SecretAuthGuard } from './../guards/secret.guard';
import { Controller, Get, Session, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(SecretAuthGuard)
  @Get('list')
  async productList() {
    return await this.productService.getList();
  }
}
