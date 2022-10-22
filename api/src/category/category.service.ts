import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoryService {
  constructor(
  ) {}

  async getUser(session: Record<string, any>) {
    return { isSuccess: true, user: session.user };
  }
}
