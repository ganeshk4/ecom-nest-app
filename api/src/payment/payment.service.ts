import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Razorpay from "razorpay";

@Injectable()
export class PaymentService {
  private instance;
  constructor(
    private readonly configService: ConfigService
  ) {
    this.instance = new Razorpay({
      key_id: this.configService.get('RAZORPAY_KEY'),
      key_secret: this.configService.get('RAZORPAY_SECRET'),
    });
  }

  async createOrder(amountInPaise: number, cartSnapshotId: number) {
    var options = {
      amount: amountInPaise,  // in paise
      currency: "INR",
      receipt: `cartSnapshotId${cartSnapshotId}`
    };
    const order = await this.instance.orders.create(options);
    return { isSuccess: true, order };
  }
}
