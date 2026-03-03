import * as dotenv from "dotenv";
dotenv.config();

import { NestFactory } from "@nestjs/core";
import { PaymentModule } from "./payment.module";

async function bootstrap() {

  console.log("🚀 Starting Payment Service...");

  const app = await NestFactory.create(PaymentModule);

  const port = process.env.PAYMENT_PORT || 9906;

  await app.listen(port);

  console.log("🟢 Payment Service running on port:", port);
}

bootstrap();