import { Controller, Get, Session, UseGuards } from '@nestjs/common';
import { SecretAuthGuard } from '../guards/secret.guard';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UseGuards(SecretAuthGuard)
  @Get('all')
  async getAllCategories() {
    return await this.categoryService.getAllCategories();
  }
}
