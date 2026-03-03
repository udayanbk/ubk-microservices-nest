import * as dotenv from "dotenv";
dotenv.config();

import { NestFactory } from "@nestjs/core";
import { InventoryModule } from "./inventory.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

async function bootstrap() {

  console.log("🚀 Starting Inventory Service...");

  const app = await NestFactory.create(InventoryModule);

  // 🔥 Connect Kafka microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [process.env.KAFKA_BROKER!],
      },
      consumer: {
        groupId: "inventory-consumer",
      },
    },
  });

  await app.startAllMicroservices();

  const port = process.env.INVENTORY_PORT!;
  await app.listen(port);

  console.log("🟢 Inventory Service running on port:", port);
  console.log("🟢 Kafka connected for Inventory Service");
}

bootstrap();