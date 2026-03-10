import { Controller, Inject } from "@nestjs/common";
import { EventPattern, ClientKafka } from "@nestjs/microservices";
import { PaymentService } from "./payment.service";
import { retryWithBackoff } from "libs/common/retry";
import { KafkaTopics } from "libs/events/topics";
import { PaymentFailedDlqEvent, PaymentFailedEvent, PaymentProcessedEvent } from "libs/events/payment.event";
import { InventoryReservedEvent } from "libs/events/inventory.events";
import { createEvent, EventEnvelope, extractKafkaPayload } from "@ecom/kafka";

@Controller()
export class PaymentEventsController {

  constructor(
    private paymentService: PaymentService,

    @Inject('KAFKA_SERVICE')
    private kafkaClient: ClientKafka
  ) { }

  @EventPattern(KafkaTopics.INVENTORY_RESERVED)
  async handleInventoryReserved(data: any) {

    console.log("🔥 RAW PAYMENT EVENT DATA:", data);

    const payload = extractKafkaPayload<EventEnvelope<InventoryReservedEvent>>(data);

    console.log("💳 Parsed payload:", payload);

    try {

      await retryWithBackoff(async () => {
        await this.paymentService.processPayment(
          payload?.payload?.orderId,
          100
        );
      }, 3);
      //------------------------forced failure-----------------------------
      // throw new Error("FORCED PAYMENT FAILURE");
      //-------------------------------------------------------------------

      console.log("✅ Payment succeeded after retry logic");

      const e_1: PaymentProcessedEvent = {
        orderId: payload?.payload?.orderId
      }

      const paymentEvent = createEvent(KafkaTopics.PAYMENT_PROCESSED, e_1)

      this.kafkaClient.emit(KafkaTopics.PAYMENT_PROCESSED, paymentEvent);

      console.log("📤 payment.processed emitted");

    } catch (error) {

      console.log("❌ All retries failed:", error.message);

      // 1️⃣ Business failure (order saga must continue)
      const e_2: PaymentFailedEvent = {
        orderId: payload?.payload?.orderId,
        productId: payload?.payload?.productId,
        quantity: payload?.payload?.quantity
      }
      const paymentFailedEvent = createEvent(KafkaTopics.PAYMENT_FAILED, e_2)
      this.kafkaClient.emit(KafkaTopics.PAYMENT_FAILED, paymentFailedEvent);

      // 2️⃣ System failure log
      const e_3: PaymentFailedDlqEvent = {
        topic: KafkaTopics.INVENTORY_RESERVED,
        payload,
        error: error.message,
        service: "payment-service"
      }
      const paymentFailedDlqEvent = createEvent(KafkaTopics.PAYMENT_FAILED_DLQ,e_3);
      this.kafkaClient.emit(KafkaTopics.PAYMENT_FAILED_DLQ, paymentFailedDlqEvent);
      console.log("📤 catch block -- payment.failed emitted");
    }

  }
}