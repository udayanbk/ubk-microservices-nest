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

      if (Math.random() < 0.5) {
        throw new Error("Gateway failed");
      }

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

  async processPayment(orderId: string) {
    console.log("💳 Processing payment for order:", orderId);
    const result = await this.paymentBreaker.fire({ orderId });
    console.log("✅ Payment success");
    return result;

  }
}