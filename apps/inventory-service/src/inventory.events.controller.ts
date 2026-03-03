import { Controller, Inject } from "@nestjs/common";
import { EventPattern, ClientKafka } from "@nestjs/microservices";
import { InventoryService } from "./inventory.service";

@Controller()
export class InventoryEventsController {

  constructor(
    private inventoryService: InventoryService,

    @Inject('KAFKA_SERVICE')
    private kafkaClient: ClientKafka
  ) { }

  @EventPattern('order.created')
  async handleOrderCreated(data: any) {

    console.log("🔥 RAW EVENT DATA:", data);

    const payload = data?.value ?? data;

    console.log("📦 Parsed payload:", payload);

    try {

      await this.inventoryService.reduceStock(
        payload.productId,
        payload.quantity
      );

      console.log("✅ Stock reduced successfully");

      this.kafkaClient.emit('inventory.reserved', {
        orderId: payload.orderId,
        productId: payload.productId,
        quantity: payload.quantity
      });

      console.log("📤 inventory.reserved emitted");

    } catch (error) {

      console.log("❌ Stock reduction failed:", error.message);

      this.kafkaClient.emit('inventory.failed', {
        orderId: payload?.orderId,
        reason: "Insufficient stock"
      });

      console.log("📤 inventory.failed emitted");
    }
  }
}