import { Controller } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";
import { OrderService } from "./order.service";
import { KafkaTopics } from "libs/events/topics";
import { PaymentFailedDlqEvent, PaymentFailedEvent, PaymentProcessedEvent } from "libs/events/payment.event";
import { InventoryFailedEvent } from "libs/events/inventory.events";
import { EventEnvelope, extractKafkaPayload } from "@ecom/kafka";

@Controller()
export class OrderEventsController {

  constructor(private orderService: OrderService) {}

@EventPattern(KafkaTopics.PAYMENT_PROCESSED)
async handlePaymentProcessed(data: any) {

  console.log("🔥 RAW payment.processed event:", data);

  const payload = extractKafkaPayload<EventEnvelope<PaymentProcessedEvent>>(data)

  console.log("💳 Parsed payment.processed payload:", payload);

  await this.orderService.markPaid(payload?.payload?.orderId);

  console.log("✅ Order marked PAID:", payload?.payload?.orderId);
}


@EventPattern(KafkaTopics.PAYMENT_FAILED)
async handlePaymentFailed(data: any) {

  console.log("🔥 RAW payment.failed event:", data);

  const payload = extractKafkaPayload<EventEnvelope<PaymentFailedEvent>>(data)

  console.log("❌ Parsed payment.failed payload:", payload);

  await this.orderService.markFailed(payload?.payload?.orderId);

  console.log("⚠ Order marked FAILED:", payload?.payload?.orderId);
}


@EventPattern(KafkaTopics.INVENTORY_FAILED)
async handleInventoryFailed(data: any) {

  console.log("🔥 RAW inventory.failed event:", data);

  const payload = extractKafkaPayload<EventEnvelope<InventoryFailedEvent>>(data)

  console.log("❌ Parsed inventory.failed payload:", payload);

  await this.orderService.markFailed(payload?.payload?.orderId);

  console.log("⚠ Order marked FAILED:", payload?.payload?.orderId);
}
}