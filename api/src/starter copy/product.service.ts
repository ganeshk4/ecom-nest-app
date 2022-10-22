import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductService {
  constructor(
  ) {}

  async getUser(session: Record<string, any>) {
    return { isSuccess: true, user: session.user };
  }
}
