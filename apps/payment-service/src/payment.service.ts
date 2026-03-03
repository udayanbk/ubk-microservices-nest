import { Injectable } from "@nestjs/common";
import { PrismaService } from "@ecom/database";

@Injectable()
export class PaymentService {

  constructor(private prisma: PrismaService) {}

  async processPayment(orderId: string, amount: number) {

    console.log("💳 Processing payment for order:", orderId);

    if (Math.random() < 0.5) {
  throw new Error("Payment failed");
}

    // Simulate success (later integrate Stripe)
    const payment = await this.prisma.payment.create({
      data: {
        orderId,
        amount,
        status: "SUCCESS"
      }
    });

    console.log("✅ Payment successful:", payment.id);

    return payment;
  }
}