import { NestFactory } from '@nestjs/core';
import { RetryModule } from './retry.module';

async function bootstrap() {
  const app = await NestFactory.create(RetryModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
