import * as dotenv from "dotenv";
dotenv.config();

import { NestFactory } from "@nestjs/core";
import { ProductModule } from "./product.module";

async function bootstrap() {

  console.log("🚀 Starting Product Service...");

  const app = await NestFactory.create(ProductModule);

  const port = process.env.PRODUCT_PORT || 9903;

  await app.listen(port);

  console.log("🟢 Product Service running on port:", port);

}

bootstrap();