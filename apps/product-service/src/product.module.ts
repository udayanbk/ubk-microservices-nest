import { Module } from '@nestjs/common';
import { ProductServiceController } from './product.controller';
import { ProductServiceService } from './product.service';

@Module({
  imports: [],
  controllers: [ProductServiceController],
  providers: [ProductServiceService],
})
export class ProductServiceModule {}
