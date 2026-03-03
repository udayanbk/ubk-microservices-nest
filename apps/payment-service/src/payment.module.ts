import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { PrismaModule } from "@ecom/database";
import { PaymentController } from "./payment.controller";
import { PaymentService } from "./payment.service";
import { PaymentEventsController } from "./payment.events.controller";

@Module({
  imports: [
    PrismaModule,
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
          },
          consumer: {
            groupId: "payment-consumer",
          },
        },
      },
    ]),
  ],
  controllers: [
    PaymentController,
    PaymentEventsController
  ],
  providers: [PaymentService],
})
export class PaymentModule {}