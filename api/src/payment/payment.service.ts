import axios from 'axios';
import { RzpResponse } from './../cart/dto/cart.dto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Razorpay from "razorpay";
import * as crypto from "crypto";
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class PaymentService {
  private instance;
  private id;
  private secret;
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.id = this.configService.get('RAZORPAY_KEY');
    this.secret = this.configService.get('RAZORPAY_SECRET');
    this.instance = new Razorpay({
      key_id: this.id,
      key_secret: this.secret,
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

  async validateSignature(rzpResponse: RzpResponse) {
    const combinedString =`${rzpResponse.razorpay_order_id}|${rzpResponse.razorpay_payment_id}`;
    const expectedSignature = crypto.createHmac('sha256', this.secret)
    .update(combinedString.toString())
    .digest('hex');

    return expectedSignature === rzpResponse.razorpay_signature;
  }

  async fetchPayment(paymentId: string) {
    return await lastValueFrom(this.httpService.get(`https://api.razorpay.com/v1/payments/${paymentId}`, {
      auth: {
        username: this.id,
        password: this.secret
      }
    }));

  }
}
