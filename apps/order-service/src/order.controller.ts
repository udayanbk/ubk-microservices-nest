import { Body, Controller, Get, Post, Req } from "@nestjs/common";
import { OrderService } from "./order.service";

@Controller("orders")
export class OrderController {

  constructor(private service: OrderService) { }

  @Post()
  async create(@Body() body: any, @Req() req: any) {

    console.log("🚀 /orders POST hit");

    const userId = req.headers["x-user-id"];

    console.log("UserId from header:", userId);

    if (!userId) {
      console.log("❌ No user in request");
      throw new Error("Unauthorized");
    }

    return this.service.createOrder(
      userId,
      body.productId,
      body.quantity
    );
  }

  @Get()
  list() {
    console.log("📋 /orders GET hit");
    return this.service.listOrders();
  }
}