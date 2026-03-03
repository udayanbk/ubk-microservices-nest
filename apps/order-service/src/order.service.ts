import { Injectable } from "@nestjs/common";
import { PrismaService } from "@ecom/database";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";

@Injectable()
export class OrderService {

  constructor(
    private prisma: PrismaService,
    private http: HttpService
  ) {}

  async createOrder(userId: string, productId: string, quantity: number) {

    console.log("🛒 OrderService.createOrder called");
    console.log("User:", userId);
    console.log("Product:", productId);
    console.log("Quantity:", quantity);

    // 1️⃣ Reduce inventory
    console.log("📦 Calling Inventory Service to reduce stock");

    await firstValueFrom(
      this.http.post(
        `${process.env.INVENTORY_SERVICE_URL}/inventory/reduce`,
        { productId, quantity }
      )
    );

    console.log("✅ Inventory reduced successfully");

    // 2️⃣ Create order
    const order = await this.prisma.order.create({
      data: {
        userId,
        productId,
        quantity,
        status: "CREATED"
      }
    });

    console.log("✅ Order created:", order.id);

    return order;
  }

  async listOrders() {

    console.log("📋 Fetching all orders");

    return this.prisma.order.findMany();
  }
}