import { Controller, Get, Session, UseGuards } from '@nestjs/common';
import { CustomerAuthGuard } from '../guards/customer.guard';
import { CategoryService } from './category.service';

@Controller()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UseGuards(CustomerAuthGuard)
  @Get('userInfo')
  async userInfo(@Session() session: Record<string, any>) {
    return await this.categoryService.getUser(session);
  }
}
