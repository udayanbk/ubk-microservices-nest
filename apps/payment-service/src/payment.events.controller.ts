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

    console.log("✅ Payment succeeded after retry logic");

    this.kafkaClient.emit('payment.processed', {
      orderId: payload.orderId
    });

    console.log("📤 payment.processed emitted");

  } catch (error) {

    console.log("❌ All retries failed:", error.message);

    this.kafkaClient.emit('payment.failed', {
      orderId: payload.orderId
    });

    console.log("📤 payment.failed emitted");

  }

}
}