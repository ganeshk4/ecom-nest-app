import { AddToCartDto } from './dto/cart.dto';
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart, CartItem, Product, ProductAvailability } from '../entities';
import { Repository } from 'typeorm';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Product)
    private readonly product: Repository<Product>,
    @InjectRepository(Cart)
    private readonly cart: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItem: Repository<CartItem>,
    @InjectRepository(ProductAvailability)
    private readonly prodAvailability: Repository<ProductAvailability>,
    
  ) {}

  private async getActiveCart(userId: number): Promise<Cart> {
    let cart = await this.cart.findOne({ where : { userId, status:"ACTIVE" }});
    if (!cart) {
      const newCart = new Cart();
      newCart.userId = userId;
      newCart.status = "ACTIVE";
      newCart.payableAmount = 0;
      cart = await this.cart.save(newCart);
    }
    return cart;
  }

  private async decreaseProductQuantity(productId: number, qty: number) {
    const pAvailability = await this.prodAvailability.findOne({ where: { productId } });
    if (Number(pAvailability.availableQty) < Number(qty)) {
      throw new ConflictException('Quantiy not available');
    }
    const remainingQty = Number(pAvailability.availableQty) - Number(qty);
    await this.prodAvailability.update({
      id: pAvailability.id
    },{
      availableQty: remainingQty
    });
    return { isSuccess: true };
  }

  async addToCart(options: AddToCartDto, session: Record<string, any>) {
    const { productId, qty } = options;
    const userCart = await this.getActiveCart(session.userId);

    const product = await this.product.findOne({ where : { id: productId }});

    const existingCartItem = await this.cartItem.findOne({ where : { productId: productId, cartId: userCart.id }});
    const pAvailability = await this.prodAvailability.findOne({ where: { productId } });
    if (Number(pAvailability.availableQty) < Number(existingCartItem?.qty||0) + Number(qty)) {
      throw new ConflictException('Quantiy not available');
    }
    if (existingCartItem && existingCartItem.id) {
      await this.cartItem.update({
        id: existingCartItem.id
      }, {
        qty: Number(existingCartItem.qty) + Number(qty)
      });
    } else {
      const newCartItem = new CartItem();
      newCartItem.cartId = userCart.id;
      newCartItem.userId = session.userId;
      newCartItem.productId = product.id;
      newCartItem.name = product.name;
      newCartItem.sellingPriceAT = product.sellingPriceAT;
      newCartItem.taxAmount = product.taxAmount;
      newCartItem.taxPercent = product.taxPercent;
      newCartItem.sellingPriceBT = product.sellingPriceBT;
      newCartItem.displayPrice = product.displayPrice;
      newCartItem.imageUrl = product.imageUrl;
      newCartItem.description = product.description;
      newCartItem.qty = qty;
      await this.cartItem.save(newCartItem);
    }

    const items = await this.cartItem.find({ where : { cartId: userCart.id } });

    let payableAmount = 0;
    for (let item of items) {
      payableAmount = Number(payableAmount) + (Number(item.sellingPriceAT)*Number(item.qty));
    }

    await this.cart.update({ 
      id: userCart.id
    }, {
      payableAmount
    });

    return { isSuccess: true };
  }

  async getDetails(session: Record<string, any>) {
    const userId = session.userId;

    const q = this.cart.createQueryBuilder('c')
    .innerJoinAndSelect('c.cartItems', 'ci')
    .where('c.userId =:userId', {userId});

    const data = await q.getMany();
    return { isSuccess: true,  data }
  }
  
}
