import { Controller, Get, Session, UseGuards } from '@nestjs/common';
import { CustomerAuthGuard } from '../guards/customer.guard';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  
  @Get('createOrder')
  async userInfo(@Session() session: Record<string, any>) {
    return await this.paymentService.createOrder(30000, 3);
  }
}
