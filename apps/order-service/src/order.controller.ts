import { Body, Controller, Get, Post, Req } from "@nestjs/common";
import { OrderService } from "./order.service";

@Controller("orders")
export class OrderController {

  constructor(
    private service: OrderService
  ) { }

  @Post()
  async create(@Body() body: any, @Req() req: any) {

    console.log("🚀 /orders POST hit");

    const userId = req.headers["x-user-id"];
    const idempotencyKey = req.headers["idempotency-key"];

    console.log("User:", userId);
    console.log("Idempotency Key:", idempotencyKey);

    if (!userId) throw new Error("Unauthorized");
    if (!idempotencyKey) throw new Error("Idempotency key required");

    return this.service.createOrder(
      userId,
      body.productId,
      body.quantity,
      idempotencyKey
    );
  }

  @Get()
  list() {
    console.log("📋 /orders GET hit");
    return this.service.listOrders();
  }
}