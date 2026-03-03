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

async createOrder(
  userId: string,
  productId: string,
  quantity: number,
  idempotencyKey: string
) {

  console.log("🛒 Starting Order Saga");

  // ✅ STEP 1 — Check idempotency FIRST
  console.log("🔎 Checking idempotency key");

  const existing = await this.prisma.idempotency.findUnique({
    where: { key: idempotencyKey }
  });

  if (existing?.orderId) {

    console.log("⚠ Duplicate request detected");

    const order = await this.prisma.order.findUnique({
      where: { id: existing.orderId }
    });

    return order;
  }

  // 🔥 If not duplicate, continue saga
  let order;

  try {

    // 2️⃣ Reduce inventory
    await firstValueFrom(
      this.http.post(
        `${process.env.INVENTORY_SERVICE_URL}/inventory/reduce`,
        { productId, quantity }
      )
    );

    console.log("✅ Inventory reduced");

    // 3️⃣ Create order
    order = await this.prisma.order.create({
      data: {
        userId,
        productId,
        quantity,
        status: "CREATED"
      }
    });

    console.log("📦 Order created:", order.id);

    // ✅ Store idempotency record immediately
    await this.prisma.idempotency.create({
      data: {
        key: idempotencyKey,
        orderId: order.id
      }
    });

    console.log("🔐 Idempotency stored");

    // 4️⃣ Call payment
    await firstValueFrom(
      this.http.post(
        `${process.env.PAYMENT_SERVICE_URL}/payments/process`,
        {
          orderId: order.id,
          amount: 100
        }
      )
    );

    console.log("💳 Payment success");

    // 5️⃣ Mark order PAID
    const updated = await this.prisma.order.update({
      where: { id: order.id },
      data: { status: "PAID" }
    });

    console.log("✅ Order marked PAID");

    return updated;

  } catch (error) {

    console.log("❌ Saga failed:", error.message);

    if (order) {
      await this.prisma.order.update({
        where: { id: order.id },
        data: { status: "FAILED" }
      });
    }

    await firstValueFrom(
      this.http.post(
        `${process.env.INVENTORY_SERVICE_URL}/inventory/increase`,
        { productId, quantity }
      )
    );

    throw new Error("Order processing failed");
  }
}

  async listOrders() {

    console.log("📋 Fetching all orders");
    return this.prisma.order.findMany();
  }
}