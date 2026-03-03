import * as dotenv from "dotenv";
dotenv.config();

import { NestFactory } from "@nestjs/core";
import { PaymentModule } from "./payment.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

async function bootstrap() {

  console.log("🚀 Starting Payment Service...");

  const app = await NestFactory.create(PaymentModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
      },
      consumer: {
        groupId: "payment-consumer",
      },
    },
  });

  await app.startAllMicroservices();

  const port = process.env.PAYMENT_PORT || 9906;
  await app.listen(port);

  console.log("🟢 Payment Service running on port:", port);
  console.log("🟢 Kafka connected for Payment Service");
}

bootstrap();

////////////////////////////////////////////////////////////////////////////////
// import * as dotenv from "dotenv";
// dotenv.config();

// import { NestFactory } from "@nestjs/core";
// import { PaymentModule } from "./payment.module";

// async function bootstrap() {

//   console.log("🚀 Starting Payment Service...");

//   const app = await NestFactory.create(PaymentModule);

//   const port = process.env.PAYMENT_PORT || 9906;

//   await app.listen(port);

//   console.log("🟢 Payment Service running on port:", port);
// }

// bootstrap();