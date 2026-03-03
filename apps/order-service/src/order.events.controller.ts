import { Controller } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";
import { OrderService } from "./order.service";

@Controller()
export class OrderEventsController {

  constructor(private orderService: OrderService) {}

@EventPattern('payment.processed')
async handlePaymentProcessed(data: any) {

  console.log("🔥 RAW payment.processed event:", data);

  const payload = data?.value ?? data;

  console.log("💳 Parsed payment.processed payload:", payload);

  await this.orderService.markPaid(payload.orderId);

  console.log("✅ Order marked PAID:", payload.orderId);
}


@EventPattern('payment.failed')
async handlePaymentFailed(data: any) {

  console.log("🔥 RAW payment.failed event:", data);

  const payload = data?.value ?? data;

  console.log("❌ Parsed payment.failed payload:", payload);

  await this.orderService.markFailed(payload.orderId);

  console.log("⚠ Order marked FAILED:", payload.orderId);
}


@EventPattern('inventory.failed')
async handleInventoryFailed(data: any) {

  console.log("🔥 RAW inventory.failed event:", data);

  const payload = data?.value ?? data;

  console.log("❌ Parsed inventory.failed payload:", payload);

  await this.orderService.markFailed(payload.orderId);

  console.log("⚠ Order marked FAILED:", payload.orderId);
}
}