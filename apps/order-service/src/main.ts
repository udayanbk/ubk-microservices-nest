import * as dotenv from "dotenv";
dotenv.config();

import { NestFactory } from "@nestjs/core";
import { OrderModule } from "./order.module";

async function bootstrap() {

  console.log("🚀 Starting Order Service...");

  const app = await NestFactory.create(OrderModule);

  const port = process.env.ORDER_PORT || 9905;

  await app.listen(port);

  console.log("🟢 Order Service running on port:", port);

}

bootstrap();