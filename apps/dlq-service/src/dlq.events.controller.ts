import { Controller } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";
import { DlqService } from "./dlq.service";
import { KafkaTopics } from "libs/events/topics";
import { PaymentFailedDlqEvent } from "libs/events/payment.event";
import { extractKafkaPayload } from "@ecom/kafka";

@Controller()
export class DlqEventsController {

  constructor(private readonly dlqService: DlqService) {}

  @EventPattern(KafkaTopics.PAYMENT_FAILED_DLQ)
  async handlePaymentDLQ(data: any) {

    console.log("🚨 DLQ EVENT RECEIVED");

    const payload = extractKafkaPayload<PaymentFailedDlqEvent>(data);

    console.log(payload);

    await this.dlqService.saveEvent(payload);

  }

}