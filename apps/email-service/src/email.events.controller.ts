import { Controller } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";
import { EmailService } from "./email.service";
import { KafkaTopics } from "libs/events/topics";
import { EventEnvelope, extractKafkaPayload } from "@ecom/kafka";
import { OrderCreatedEvent } from "libs/events/order.events";
import { PaymentFailedEvent } from "libs/events/payment.event";

@Controller()
export class EmailEventsController {

  constructor(private emailService: EmailService) {}

  @EventPattern(KafkaTopics.ORDER_CREATED)
  async handleOrderCreated(data: any) {

    const event = extractKafkaPayload<EventEnvelope<OrderCreatedEvent>>(data);

    console.log("📧 Order created email triggered", event);

    await this.emailService.sendOrderCreatedEmail(
      event?.payload?.userId,
      event?.payload?.orderId
    );
  }

  @EventPattern(KafkaTopics.PAYMENT_FAILED)
  async handlePaymentFailed(data: any) {

    console.log("📧 Payment failed email triggered");
    const event = extractKafkaPayload<EventEnvelope<PaymentFailedEvent>>(data);
    await this.emailService.sendOrderFailedEmail(
      event?.payload?.orderId,
      event?.payload?.orderId
    );
  }

}