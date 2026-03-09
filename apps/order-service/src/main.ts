import * as dotenv from "dotenv";
dotenv.config();

import { NestFactory } from "@nestjs/core";
import { OrderModule } from "./order.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

async function bootstrap() {

  console.log("🚀 Starting Order Service...");

  const app = await NestFactory.create(OrderModule);

  // 🔥 Connect Kafka microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
      },
      consumer: {
        groupId: "order-consumer",
      },
    },
  });

  await app.startAllMicroservices();

  const port = process.env.ORDER_PORT || 9905;
  // await app.listen(port);
  await app.listen(port, "0.0.0.0");

  console.log("🟢 Order Service running on port:", port);
  console.log("🟢 Kafka connected for Order Service");
}

bootstrap();

//////////////////////////////////////////////////////////////////////////////
// import * as dotenv from "dotenv";
// dotenv.config();

// import { NestFactory } from "@nestjs/core";
// import { OrderModule } from "./order.module";

// async function bootstrap() {

//   console.log("🚀 Starting Order Service...");

//   const app = await NestFactory.create(OrderModule);

//   const port = process.env.ORDER_PORT || 9905;

//   await app.listen(port);

//   console.log("🟢 Order Service running on port:", port);

// }

// bootstrap();