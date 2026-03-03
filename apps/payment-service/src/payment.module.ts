import { Module } from '@nestjs/common';
import { PaymentServiceController } from './payment.controller';
import { PaymentServiceService } from './payment.service';

@Module({
  imports: [],
  controllers: [PaymentServiceController],
  providers: [PaymentServiceService],
})
export class PaymentServiceModule {}
