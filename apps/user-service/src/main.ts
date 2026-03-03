import * as dotenv from "dotenv";
dotenv.config();

import { NestFactory } from "@nestjs/core";
import { UserModule } from "./user.module";

async function bootstrap() {

  console.log("🚀 Starting User Service...");

  const app = await NestFactory.create(UserModule);

  const port = process.env.USER_PORT || 9902;

  await app.listen(port);

  console.log("🟢 User Service running on port:", port);

}

bootstrap();