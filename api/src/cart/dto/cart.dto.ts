import { IsNumber, IsString, Length } from "class-validator";

export class AddToCartDto {
  @IsNumber()
  productId: number;

  @IsNumber()
  qty: number;
}

export class RzpResponse {
  @IsString()
  razorpay_payment_id: string;

  @IsString()
  razorpay_order_id: string;

  @IsString()
  razorpay_signature: string;
}