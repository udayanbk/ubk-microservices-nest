import { Injectable, Inject } from "@nestjs/common";
import { PrismaService } from "@ecom/database";
import { ClientKafka } from "@nestjs/microservices";

@Injectable()
export class OrderService {

  constructor(
    private prisma: PrismaService,

    @Inject('KAFKA_SERVICE')
    private kafkaClient: ClientKafka
  ) {}

  async onModuleInit() {
    // Required for Kafka response topics
    this.kafkaClient.subscribeToResponseOf('payment.processed');
    await this.kafkaClient.connect();
    console.log("🟢 Order Service connected to Kafka");
  }

  async createOrder(
    userId: string,
    productId: string,
    quantity: number,
    idempotencyKey: string
  ) {

    console.log("🛒 Starting Order Saga");

    // 1️⃣ Check idempotency FIRST
    console.log("🔎 Checking idempotency key");

    const existing = await this.prisma.idempotency.findUnique({
      where: { key: idempotencyKey }
    });

    if (existing?.orderId) {

      console.log("⚠ Duplicate request detected");

      return this.prisma.order.findUnique({
        where: { id: existing.orderId }
      });
    }

    // 2️⃣ Create order (PENDING)
    const order = await this.prisma.order.create({
      data: {
        userId,
        productId,
        quantity,
        status: "PENDING"
      }
    });

    console.log("📦 Order created:", order.id);

    // 3️⃣ Store idempotency
    await this.prisma.idempotency.create({
      data: {
        key: idempotencyKey,
        orderId: order.id
      }
    });

    console.log("🔐 Idempotency stored");

    // 4️⃣ Emit event to Kafka
    console.log("📤 Emitting order.created event");

    this.kafkaClient.emit('order.created', {
      orderId: order.id,
      productId,
      quantity,
      userId
    });

    // 5️⃣ Immediately return (async processing)
    return {
      message: "Order placed, processing asynchronously",
      orderId: order.id,
      status: "PENDING"
    };
  }

  // 🔥 Listen for Payment Processed Event
  async handlePaymentProcessed(data: any) {

    console.log("💳 payment.processed event received:", data);

    await this.prisma.order.update({
      where: { id: data.orderId },
      data: { status: "PAID" }
    });

    console.log("✅ Order marked PAID via event");
  }

  // 🔥 Listen for Payment Failed Event
  async handlePaymentFailed(data: any) {

    console.log("❌ payment.failed event received:", data);

    await this.prisma.order.update({
      where: { id: data.orderId },
      data: { status: "FAILED" }
    });

    console.log("⚠ Order marked FAILED via event");
  }

  async listOrders() {
    console.log("📋 Fetching all orders");
    return this.prisma.order.findMany();
  }

  async markPaid(orderId: string) {

  console.log("🟢 Updating order to PAID:", orderId);

  return this.prisma.order.update({
    where: { id: orderId },
    data: { status: "PAID" }
  });
}


async markFailed(orderId: string) {

  console.log("🔴 Updating order to FAILED:", orderId);

  return this.prisma.order.update({
    where: { id: orderId },
    data: { status: "FAILED" }
  });
}
}

///////////////////////////////////////////////////////////////////////////////////////////

// import { Injectable } from "@nestjs/common";
// import { PrismaService } from "@ecom/database";
// import { HttpService } from "@nestjs/axios";
// import { firstValueFrom } from "rxjs";

// @Injectable()
// export class OrderService {

//   constructor(
//     private prisma: PrismaService,
//     private http: HttpService
//   ) { }

// async createOrder(
//   userId: string,
//   productId: string,
//   quantity: number,
//   idempotencyKey: string
// ) {

//   console.log("🛒 Starting Order Saga");

//   // ✅ STEP 1 — Check idempotency FIRST
//   console.log("🔎 Checking idempotency key");

//   const existing = await this.prisma.idempotency.findUnique({
//     where: { key: idempotencyKey }
//   });

//   if (existing?.orderId) {

//     console.log("⚠ Duplicate request detected");

//     const order = await this.prisma.order.findUnique({
//       where: { id: existing.orderId }
//     });

//     return order;
//   }

//   // 🔥 If not duplicate, continue saga
//   let order;

//   try {

//     // 2️⃣ Reduce inventory
//     await firstValueFrom(
//       this.http.post(
//         `${process.env.INVENTORY_SERVICE_URL}/inventory/reduce`,
//         { productId, quantity }
//       )
//     );

//     console.log("✅ Inventory reduced");

//     // 3️⃣ Create order
//     order = await this.prisma.order.create({
//       data: {
//         userId,
//         productId,
//         quantity,
//         status: "CREATED"
//       }
//     });

//     console.log("📦 Order created:", order.id);

//     // ✅ Store idempotency record immediately
//     await this.prisma.idempotency.create({
//       data: {
//         key: idempotencyKey,
//         orderId: order.id
//       }
//     });

//     console.log("🔐 Idempotency stored");

//     // 4️⃣ Call payment
//     await firstValueFrom(
//       this.http.post(
//         `${process.env.PAYMENT_SERVICE_URL}/payments/process`,
//         {
//           orderId: order.id,
//           amount: 100
//         }
//       )
//     );

//     console.log("💳 Payment success");

//     // 5️⃣ Mark order PAID
//     const updated = await this.prisma.order.update({
//       where: { id: order.id },
//       data: { status: "PAID" }
//     });

//     console.log("✅ Order marked PAID");

//     return updated;

//   } catch (error) {

//     console.log("❌ Saga failed:", error.message);

//     if (order) {
//       await this.prisma.order.update({
//         where: { id: order.id },
//         data: { status: "FAILED" }
//       });
//     }

//     await firstValueFrom(
//       this.http.post(
//         `${process.env.INVENTORY_SERVICE_URL}/inventory/increase`,
//         { productId, quantity }
//       )
//     );

//     throw new Error("Order processing failed");
//   }
// }

//   async listOrders() {

//     console.log("📋 Fetching all orders");
//     return this.prisma.order.findMany();
//   }
// }