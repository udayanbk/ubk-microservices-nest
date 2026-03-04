import { Controller, Inject } from "@nestjs/common";
import { EventPattern, ClientKafka } from "@nestjs/microservices";
import { PaymentService } from "./payment.service";
import { retryWithBackoff } from "libs/common/retry";

@Controller()
export class PaymentEventsController {

  constructor(
    private paymentService: PaymentService,

    @Inject('KAFKA_SERVICE')
    private kafkaClient: ClientKafka
  ) { }

  @EventPattern('inventory.reserved')
  async handleInventoryReserved(data: any) {

    console.log("🔥 RAW PAYMENT EVENT DATA:", data);

    const payload = data?.value ?? data;

    console.log("💳 Parsed payload:", payload);

    try {

      await retryWithBackoff(async () => {
        await this.paymentService.processPayment(
          payload.orderId,
          100
        );
      }, 3);
      //------------------------forced failure-----------------------------
      // throw new Error("FORCED PAYMENT FAILURE");
      //-------------------------------------------------------------------

      console.log("✅ Payment succeeded after retry logic");

      this.kafkaClient.emit('payment.processed', {
        orderId: payload.orderId
      });

      console.log("📤 payment.processed emitted");

    } catch (error) {

      console.log("❌ All retries failed:", error.message);

      // 1️⃣ Business failure (order saga must continue)
      this.kafkaClient.emit('payment.failed', {
        orderId: payload.orderId
      });

      // 2️⃣ System failure log
      this.kafkaClient.emit("payment.failed.dlq", {
        topic: "inventory.reserved",
        payload,
        error: error.message,
        service: "payment-service"
      });
      console.log("📤 catch block -- payment.failed emitted");
    }

  }
}