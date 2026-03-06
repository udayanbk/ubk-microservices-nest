import { Injectable, Inject } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { PrismaService } from "@ecom/database";
import { ClientKafka } from "@nestjs/microservices";
import { createEvent } from "@ecom/kafka";

@Injectable()
export class OutboxPublisher {

  constructor(
    private prisma: PrismaService,

    @Inject("KAFKA_SERVICE")
    private kafkaClient: ClientKafka
  ) { }

  @Cron('*/5 * * * * *')
  async handleCron() {
    await this.publishEvents();
  }

  async publishEvents() {
    console.log("🔎 Checking outbox events");
    const events = await this.prisma.outboxEvent.findMany({
      where: { status: "PENDING" }
    });
    console.log("🔎 Found outbox events", events);
    for (const event of events) {

      console.log("📤 Publishing event:", event.topic);

      const e = createEvent(event.topic, event.payload)

      await this.kafkaClient.emit(event.topic, e);

      await this.prisma.outboxEvent.update({
        where: { id: event.id },
        data: { status: "PUBLISHED" }
      });

      console.log("✅ Event published:", event.id);

    }

  }

}