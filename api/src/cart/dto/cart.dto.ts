import { IsNumber, Length } from "class-validator";

export class AddToCartDto {
  @IsNumber()
  productId: number;

  @IsNumber()
  qty: number;
}