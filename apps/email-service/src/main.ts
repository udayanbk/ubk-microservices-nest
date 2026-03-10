import { NestFactory } from "@nestjs/core";
import { EmailModule } from "./email.module";
import { Transport } from "@nestjs/microservices";

async function bootstrap() {

  const app = await NestFactory.createMicroservice(
    EmailModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [process.env.KAFKA_BROKER || "kafka:29092"]
        },
        consumer: {
          groupId: "email-consumer"
        }
      }
    }
  );

  await app.listen();

  console.log("📧 Email Service running");
}

bootstrap();