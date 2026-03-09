import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { PrismaModule } from '@ecom/database';
import { HealthController } from './health.controller';

@Module({
  imports: [PrismaModule],
  controllers: [ProductController, HealthController],
  providers: [ProductService],
})
export class ProductModule {}
