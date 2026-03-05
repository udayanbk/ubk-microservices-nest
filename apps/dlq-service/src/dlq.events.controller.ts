import { Controller } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";
import { DlqService } from "./dlq.service";
import { KafkaTopics } from "@ecom/kafka/topics";

@Controller()
export class DlqEventsController {

  constructor(private readonly dlqService: DlqService) {}

  @EventPattern(KafkaTopics.PAYMENT_FAILED_DLQ)
  async handlePaymentDLQ(data: any) {

    console.log("🚨 DLQ EVENT RECEIVED");

    const payload = data?.value ?? data;

    console.log(payload);

    await this.dlqService.saveEvent(payload);

  }

}