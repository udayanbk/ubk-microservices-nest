import { Controller, Inject } from "@nestjs/common";
import { EventPattern, ClientKafka } from "@nestjs/microservices";
import { InventoryService } from "./inventory.service";
import { KafkaTopics } from "libs/events/topics";
import { InventoryFailedEvent, InventoryReservedEvent } from "libs/events/inventory.events";
import type { OrderCreatedEvent } from "libs/events/order.events";
import { createEvent, EventEnvelope, extractKafkaPayload } from "@ecom/kafka";

@Controller()
export class InventoryEventsController {

  constructor(
    private inventoryService: InventoryService,

    @Inject('KAFKA_SERVICE')
    private kafkaClient: ClientKafka
  ) { }

  @EventPattern(KafkaTopics.ORDER_CREATED)
  async handleOrderCreated(data: any) {

    const event = data as EventEnvelope<OrderCreatedEvent>
    const payload = event.payload
    console.log("📦 EVENT:", event)
    console.log("📦 ORDER_CREATED payload:", payload)

    if (!payload?.orderId || !payload?.productId) {
      console.error("❌ Invalid ORDER_CREATED payload", payload)
      return
    }

    try {

      await this.inventoryService.reduceStock(
        payload.productId,
        payload.quantity
      )

      const e: InventoryReservedEvent = {
        orderId: payload.orderId,
        productId: payload.productId,
        quantity: payload.quantity
      }

      const invResEvent = createEvent(KafkaTopics.INVENTORY_RESERVED, e)

      this.kafkaClient.emit(KafkaTopics.INVENTORY_RESERVED, invResEvent)

      console.log("📤 inventory.reserved emitted")

    } catch (error) {

      console.error("❌ Stock reduction failed:", error.message)

      if(!payload?.orderId){
        console.log("missing orderid for inventory.failed event", payload);
        return
      }

      const e: InventoryFailedEvent = {
        orderId: payload.orderId,
        productId: payload.productId,
        reason: "Insufficient stock"
      }

      const invFailEvent = createEvent(KafkaTopics.INVENTORY_FAILED, e)

      this.kafkaClient.emit(KafkaTopics.INVENTORY_FAILED, invFailEvent)

      console.log("📤 inventory.failed emitted")
    }
  }
}