import { NestFactory } from "@nestjs/core";
import { DlqModule } from "./dlq.module";
import { Transport } from "@nestjs/microservices";

async function bootstrap() {

  const app = await NestFactory.createMicroservice(DlqModule, {

    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ["localhost:9092"],
      },
      consumer: {
        groupId: "dlq-consumer",
      },
    },

  });

  await app.listen();

  console.log("🟢 DLQ Service running and listening to Kafka");

}

bootstrap();