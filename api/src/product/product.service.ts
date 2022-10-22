import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductService {
  constructor(
  ) {}

  async getList() {
    return { isSuccess: true };
  }
}
