import { Order } from './../entities/order.entity';
import { AddToCartDto, RzpResponse } from './dto/cart.dto';
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart, CartItem, CartSnapshot, CartSnapshotItem, OrderItem, Product, ProductAvailability } from '../entities';
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
    @InjectRepository(Order)
    private readonly order: Repository<Order>,
    @InjectRepository(CartItem)
    private readonly cartItem: Repository<CartItem>,
    @InjectRepository(CartSnapshotItem)
    private readonly cartSnapshotItem: Repository<CartSnapshotItem>,
    @InjectRepository(OrderItem)
    private readonly orderItem: Repository<OrderItem>,
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


  async verifyOrder(session: Record<string, any>, rzpResponse: RzpResponse)  {
    const isValid = await this.paymentService.validateSignature(rzpResponse);
    if (!isValid) {
      throw new ConflictException('invalid request response');
    }
    
    let isPaymentVerified = false;
    const { data: payment } = await this.paymentService.fetchPayment(rzpResponse.razorpay_payment_id);

    if (payment && payment.id === rzpResponse.razorpay_payment_id && payment.captured) {
      isPaymentVerified = true;
    }

    if (!isPaymentVerified) {
      throw new ConflictException('payment not verified');
    }

    return await this.confirmOrder(payment, rzpResponse);
    
  }

  private async confirmOrder(payment: any, rzpResponse: RzpResponse) {
    // run validations before calling this function
    const rzpOrderId = payment.order_id;
    let cartSnapshot = await this.cartSnapshot.findOne({ where: { razorpay_order_id: rzpOrderId  } });
    const cartSnapshotItems = await this.cartSnapshotItem.find({ where: { cartSnId: cartSnapshot.id} });
    const paidAmount = Number(payment.amount)/100;
    if (Number(cartSnapshot.payableAmount) === paidAmount) {
      let totalTaxAmt=0;
      let totalSellingPriceBT=0;
      for (const item of cartSnapshotItems) {
        totalTaxAmt = Number(totalTaxAmt) + (Number(item.taxAmount)*Number(item.qty));
        totalSellingPriceBT = Number(totalSellingPriceBT) + (Number(item.sellingPriceBT)*Number(item.qty));
      }
      await this.cartSnapshot.update({
        id: cartSnapshot.id
      },{
        paidAmount,
        status: "VERIFIED",
        razorpay_payment_id: payment.id,
        razorpay_signature: rzpResponse.razorpay_signature,
        razorpay_response: payment,
        fromWebhook: false,
        totalTaxAmount: totalTaxAmt,
        totalSellingPriceBT
      });

      cartSnapshot = await this.cartSnapshot.findOne({ where: { id: cartSnapshot.id  } });

      const newOrder = new Order();
      newOrder.userId = cartSnapshot.userId;
      newOrder.cartSnId = cartSnapshot.id;
      newOrder.status = "PLACED";
      newOrder.payableAmount = cartSnapshot.payableAmount;
      newOrder.paidAmount = paidAmount;
      newOrder.totalTaxAmount = totalTaxAmt;
      newOrder.totalSellingPriceBT = totalSellingPriceBT;

      const createdOrder = await this.order.save(newOrder);
  
      for (const item of cartSnapshotItems) {
        await this.decreaseProductQuantity(item.productId, item.qty);

        const newOrderItem = new OrderItem();
        newOrderItem.orderId = createdOrder.id;
        newOrderItem.userId = createdOrder.userId;
        newOrderItem.productId = item.productId;
        newOrderItem.name = item.name;
        newOrderItem.status = 'PLACED';
        newOrderItem.sellingPriceAT = item.sellingPriceAT;
        newOrderItem.taxAmount = item.taxAmount;
        newOrderItem.taxPercent = item.taxPercent;
        newOrderItem.sellingPriceBT = item.sellingPriceBT;
        newOrderItem.displayPrice = item.displayPrice;
        newOrderItem.qty = item.qty;
        newOrderItem.imageUrl = item.imageUrl;
        newOrderItem.description = item.description;
        await this.orderItem.save(newOrderItem);

        await this.cartItem.delete({ userId: createdOrder.userId, productId: item.productId});
      }

      
      await this.cartSnapshot.update({
        id: cartSnapshot.id
      },{
        orderId: createdOrder.id
      });

      await this.order.update({
        id: createdOrder.id
      },{
        status: "QUEUED"
      });
    }
    return { isSuccess: true };
  }
}
