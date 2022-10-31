import { AddToCartDto } from './dto/cart.dto';
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart, CartItem, CartSnapshot, CartSnapshotItem, Product, ProductAvailability } from '../entities';
import { Repository } from 'typeorm';
import { PaymentService } from '../payment/payment.service';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Product)
    private readonly product: Repository<Product>,
    @InjectRepository(Cart)
    private readonly cart: Repository<Cart>,
    @InjectRepository(CartSnapshot)
    private readonly cartSnapshot: Repository<CartSnapshot>,
    @InjectRepository(CartItem)
    private readonly cartItem: Repository<CartItem>,
    @InjectRepository(CartSnapshotItem)
    private readonly cartSnapshotItem: Repository<CartSnapshotItem>,
    @InjectRepository(ProductAvailability)
    private readonly prodAvailability: Repository<ProductAvailability>,
    private readonly paymentService: PaymentService
    
  ) {}

  private async getActiveCart(userId: number): Promise<Cart> {
    let cart = await this.cart.findOne({ 
      where : { userId, status:"ACTIVE" }
    });
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

  async getCartDetails(session: Record<string, any>) {
    const userId = session.userId;

    const q = this.cart.createQueryBuilder('c')
    .innerJoinAndSelect('c.cartItems', 'ci')
    .where('c.userId =:userId', {userId})
    .andWhere('c.status ="ACTIVE"');

    const data = await q.getOne();
    return { isSuccess: true,  data }
  }


  async validateCartDetails(userId: number) {
    const userCart = await this.getActiveCart(userId);
    const cartItems = await this.cartItem.find({ where : { cartId: userCart.id }});
    let payableAmount = 0;
    for (const item of cartItems) {
      const pAvailability = await this.prodAvailability.findOne({ where: { productId: item.productId } });
      if (Number(pAvailability.availableQty) < Number(item.qty)) {
        throw new ConflictException('Quantiy not available');
      }
      payableAmount = Number(payableAmount) + (Number(item.sellingPriceAT)*Number(item.qty));
    }
    if (Number(payableAmount) != Number(userCart.payableAmount)) {
      throw new ConflictException('cart amount data incorrect');
    }

    return { isSucccess: true, userCart };
  }
  

  async getOrderLink(session: Record<string, any>) {
    const userId = session.userId;
    const validation = await this.validateCartDetails(userId);
    if (!validation.isSucccess) {
      throw new ConflictException('can not generate order- invalid cart');
    }
    const userCart = validation.userCart;

    let newCartSnapshot = new CartSnapshot();
    newCartSnapshot.userId = userId;
    //cartSnapshot.orderId = userId; later use
    newCartSnapshot.status = 'VERIFICATION_PENDING';
    newCartSnapshot.payableAmount = userCart.payableAmount;
    newCartSnapshot.paidAmount = 0;
    newCartSnapshot.totalTaxAmount = 0;
    newCartSnapshot.totalSellingPriceBT = 0;
    //cartSnapshot.razorpay_order_id = '' // later use
  
    newCartSnapshot = await this.cartSnapshot.save(newCartSnapshot);

    const createOrderResp = await this.paymentService.createOrder(userCart.payableAmount*100, newCartSnapshot.id);
    if (!createOrderResp.isSuccess) {
      throw new ConflictException('can not generate order - create order failure');
    }

    const razorpay_order_id = createOrderResp.order.id;
    await this.cartSnapshot.update({
      id: newCartSnapshot.id
    },{
      razorpay_order_id
    });

    const cartItems = await this.cartItem.find({ where : { cartId: userCart.id }});
    for (const cartItem of cartItems) {
      const newCartSnapshotItem = new CartSnapshotItem();
      newCartSnapshotItem.cartSnId = newCartSnapshot.id;
      newCartSnapshotItem.userId = userId;
      newCartSnapshotItem.productId = cartItem.productId;
      newCartSnapshotItem.name = cartItem.name;
      newCartSnapshotItem.sellingPriceAT = cartItem.sellingPriceAT;
      newCartSnapshotItem.taxAmount = cartItem.taxAmount;
      newCartSnapshotItem.taxPercent = cartItem.taxPercent;
      newCartSnapshotItem.sellingPriceBT = cartItem.sellingPriceBT;
      newCartSnapshotItem.displayPrice = cartItem.displayPrice;
      newCartSnapshotItem.qty = cartItem.qty;
      newCartSnapshotItem.imageUrl = cartItem.imageUrl;
      newCartSnapshotItem.description = cartItem.description;
      await this.cartSnapshotItem.save(newCartSnapshotItem);
    }
    //const data = await q.getOne();
    return { isSuccess: true, razorpay_order_id }
  }
}
