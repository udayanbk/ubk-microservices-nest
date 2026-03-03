import { Injectable } from "@nestjs/common";
import { PrismaService } from "@ecom/database";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";

@Injectable()
export class OrderService {

  constructor(
    private prisma: PrismaService,
    private http: HttpService
  ) { }

  async createOrder(userId: string, productId: string, quantity: number) {

    console.log("🛒 Starting Order Saga");

    let order;

    try {

      // 1️⃣ Reduce inventory
      await firstValueFrom(
        this.http.post(
          `${process.env.INVENTORY_SERVICE_URL}/inventory/reduce`,
          { productId, quantity }
        )
      );

      console.log("✅ Inventory reduced");

      // 2️⃣ Create order
      order = await this.prisma.order.create({
        data: {
          userId,
          productId,
          quantity,
          status: "CREATED"
        }
      });

      console.log("📦 Order created:", order.id);

      // 3️⃣ Process payment
      const payment = await firstValueFrom(
        this.http.post(
          `${process.env.PAYMENT_SERVICE_URL}/payments/process`,
          {
            orderId: order.id,
            amount: 100
          }
        )
      );

      console.log("💳 Payment success:", payment.data.id);

      // 4️⃣ Mark order as PAID
      const updated = await this.prisma.order.update({
        where: { id: order.id },
        data: { status: "PAID" }
      });

      console.log("✅ Order marked PAID");

      return updated;

    } catch (error) {

      console.log("❌ Saga failed:", error.message);

      // COMPENSATION LOGIC

      if (order) {
        await this.prisma.order.update({
          where: { id: order.id },
          data: { status: "FAILED" }
        });
        console.log("⚠ Order marked FAILED");
      }

      // Restore inventory
      await firstValueFrom(
        this.http.post(
          `${process.env.INVENTORY_SERVICE_URL}/inventory/increase`,
          { productId, quantity }
        )
      );

      console.log("♻ Inventory restored correctly");

      throw new Error("Order processing failed");
    }
  }

  async listOrders() {

    console.log("📋 Fetching all orders");
    return this.prisma.order.findMany();
  }
}