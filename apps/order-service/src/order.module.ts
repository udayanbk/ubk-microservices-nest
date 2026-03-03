import { Module } from '@nestjs/common';
import { OrderServiceController } from './order.controller';
import { OrderServiceService } from './order.service';

@Module({
  imports: [],
  controllers: [OrderServiceController],
  providers: [OrderServiceService],
})
export class OrderServiceModule {}
