import { Controller, Inject } from "@nestjs/common";
import { EventPattern, ClientKafka } from "@nestjs/microservices";
import { InventoryService } from "./inventory.service";
import { KafkaTopics } from "libs/events/topics";
import { InventoryFailedEvent, InventoryReservedEvent } from "libs/events/inventory.events";
import type { OrderCreatedEvent } from "libs/events/order.events";

@Controller()
export class InventoryEventsController {

  constructor(
    private inventoryService: InventoryService,

    @Inject('KAFKA_SERVICE')
    private kafkaClient: ClientKafka
  ) { }

  @EventPattern(KafkaTopics.ORDER_CREATED)
  async handleOrderCreated(data: any) {

    console.log("🔥 RAW EVENT DATA:", data);

    const payload: OrderCreatedEvent = data?.value ?? data;

    console.log("📦 Parsed payload:", payload);

    try {

      await this.inventoryService.reduceStock(
        payload.productId,
        payload.quantity
      );

      console.log("✅ Stock reduced successfully");

      const event: InventoryReservedEvent = {
        orderId: payload.orderId,
        productId: payload.productId,
        quantity: payload.quantity
      }

      this.kafkaClient.emit(KafkaTopics.INVENTORY_RESERVED, event);

      console.log("📤 inventory.reserved emitted");

    } catch (error) {

      console.log("❌ Stock reduction failed:", error.message);

      const event: InventoryFailedEvent = {
        orderId: payload?.orderId,
        reason: "Insufficient stock"
      }

      this.kafkaClient.emit(KafkaTopics.INVENTORY_FAILED, event);

      console.log("📤 inventory.failed emitted");
    }
  }
}