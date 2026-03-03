import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AuthServiceModule } from './auth.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthServiceModule);
  const port = process?.env?.AUTH_PORT!;
  await app.listen(port);
  console.log(`Auth Service running on ${port}`);
}
bootstrap();
