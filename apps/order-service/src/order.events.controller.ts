import { Controller, Inject } from "@nestjs/common";
import { ClientKafka, EventPattern } from "@nestjs/microservices";
import { OrderService } from "./order.service";
import { KafkaTopics } from "libs/events/topics";
import { PaymentFailedDlqEvent, PaymentFailedEvent, PaymentProcessedEvent } from "libs/events/payment.event";
import { InventoryFailedEvent } from "libs/events/inventory.events";
import { createEvent, EventEnvelope, extractKafkaPayload } from "@ecom/kafka";

@Controller()
export class OrderEventsController {

  constructor(
    private orderService: OrderService,
    @Inject('KAFKA_SERVICE')
    private kafkaClient: ClientKafka
  ) { }

  @EventPattern(KafkaTopics.PAYMENT_PROCESSED)
  async handlePaymentProcessed(data: any) {

    console.log("🔥 RAW payment.processed event:", data);

    const event = extractKafkaPayload<EventEnvelope<PaymentProcessedEvent>>(data)

    console.log("💳 Parsed payment.processed event:", event);

    await this.orderService.markPaid(event?.payload?.orderId);

    console.log("✅ Order marked PAID:", event?.payload?.orderId);
  }


  @EventPattern(KafkaTopics.PAYMENT_FAILED)
  async handlePaymentFailed(data: any) {

    console.log("🔥 RAW payment.failed event:", data);

    const event = extractKafkaPayload<EventEnvelope<PaymentFailedEvent>>(data)

    console.log("❌ Parsed payment.failed event:", event);
    const retryCount = event?.retryCount ?? 0

    try {
      await this.orderService.markFailed(event.payload.orderId);
      console.log("Order marked failed: ", event.payload.orderId);
      const order = await this.orderService.getOrder(event.payload.orderId);
      if(!order) {
        console.log("Order not found for compensation..");
        return;
      }
      const releaseEvent = createEvent(KafkaTopics.INVENTORY_RELEASE, {
        orderId: order?.id,
        productId: order?.productId,
        quantity: order?.quantity
      })
      this.kafkaClient.emit(KafkaTopics.INVENTORY_RELEASE, releaseEvent);
      console.log("Inventory Release emitted..!!")
    }
    catch (error) {
      console.log("Payment failed processing error");
      // if(retryCount < 3){
      //   console.log("Retrying payment attempt: ", retryCount + 1);
      //   const retryEvent =
      //     createEvent(KafkaTopics.PAYMENT_FAILED, payload, "v1", retryCount + 1)

      //   this.kafkaClient.emit(
      //     KafkaTopics.PAYMENT_FAILED,
      //     retryEvent
      //   )
      // }
      // else{
      //   console.log("Sending to DLQ");
      //   const dlqEvent =
      //     createEvent(KafkaTopics.PAYMENT_FAILED_DLQ, payload)

      //   this.kafkaClient.emit(
      //     KafkaTopics.PAYMENT_FAILED_DLQ,
      //     dlqEvent
      //   )
      // }

      // using retry service for retrying payment
      const retryEvent = createEvent(
        KafkaTopics.PAYMENT_FAILED,
        event.payload,
        "v1",
        retryCount + 1
      )
      this.kafkaClient.emit(KafkaTopics.PAYMENT_FAILED_RETRY, retryEvent);
    }



    console.log("⚠ Order marked FAILED:", event?.payload?.orderId);
  }


  @EventPattern(KafkaTopics.INVENTORY_FAILED)
  async handleInventoryFailed(data: any) {

    console.log("🔥 RAW inventory.failed event:", data);

    const event = extractKafkaPayload<EventEnvelope<InventoryFailedEvent>>(data)

    console.log("❌ Parsed inventory.failed event:", event);

    await this.orderService.markFailed(event?.payload?.orderId);

    console.log("⚠ Order marked FAILED:", event?.payload?.orderId);
  }
}