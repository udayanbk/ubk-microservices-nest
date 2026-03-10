import { Injectable } from "@nestjs/common";
import { PrismaService } from "@ecom/database";
import { createCircuitBreaker } from "libs/common/circuit-breaker";

@Injectable()
export class PaymentService {

  // constructor(private prisma: PrismaService) {}

  private paymentBreaker;

  constructor() {

    const paymentCall = async (payload: any) => {

      console.log("💳 Calling external payment gateway");
      console.log("Order:", payload.orderId);
      console.log("Amount:", payload.amount);

      //-------use following throw to check DLQ logs for payment failure----------------------------
      // if (Math.random() < 0.3) {
      //   throw new Error("Gateway failed");
      // }

      return { success: true };

    };

    this.paymentBreaker = createCircuitBreaker(paymentCall, "PAYMENT_GATEWAY");
  }

  // async processPayment(orderId: string, amount: number) {

  //   console.log("💳 Processing payment for order:", orderId);

  //   // Simulate success (later integrate Stripe)
  //   const payment = await this.prisma.payment.create({
  //     data: {
  //       orderId,
  //       amount,
  //       status: "SUCCESS"
  //     }
  //   });

  //   console.log("✅ Payment successful:", payment.id);

  //   return payment;
  // }

  async processPayment(orderId: string, amount: number) {
    console.log("💳 Processing payment for order:", orderId);
    throw new Error("Testing Payment Gateway down...!!!")
    const result = await this.paymentBreaker.fire({
      orderId,
      amount
    });
    console.log("✅ Payment success");
    return result;

  }
}