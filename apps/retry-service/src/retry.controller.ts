import { Controller, Inject } from "@nestjs/common";
import { EventPattern, ClientKafka } from "@nestjs/microservices";
import { KafkaTopics } from "libs/events/topics";
import { createEvent, extractKafkaPayload, EventEnvelope } from "@ecom/kafka";

@Controller()
export class RetryController {

  constructor(
    @Inject("KAFKA_SERVICE")
    private kafkaClient: ClientKafka
  ) {}

  @EventPattern(KafkaTopics.PAYMENT_FAILED_RETRY)
  async handleRetry(data: any) {

    const event =
      extractKafkaPayload<EventEnvelope<any>>(data)

    const retryCount = event.retryCount ?? 0

    console.log("🔁 Retry event received", retryCount)

    if (retryCount >= 3) {

      console.log("☠ Sending to DLQ")

      const dlqEvent =
        createEvent(KafkaTopics.PAYMENT_FAILED_DLQ, event.payload)

      this.kafkaClient.emit(
        KafkaTopics.PAYMENT_FAILED_DLQ,
        dlqEvent
      )

      return
    }

    await this.delay(5000)

    const retryEvent =
      createEvent(
        event.eventType,
        event.payload,
        "v1",
        retryCount + 1
      )

    this.kafkaClient.emit(
      event.eventType,
      retryEvent
    )
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}