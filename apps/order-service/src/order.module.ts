import { ScheduleModule } from "@nestjs/schedule";
import { Module } from "@nestjs/common";
// import { HttpModule } from "@nestjs/axios";
import { PrismaModule } from "@ecom/database";
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OrderEventsController } from "./order.events.controller";
import { OutboxPublisher } from "./outbox.publisher";
import { HealthController } from "./health.controller";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: [process.env.KAFKA_BROKER!],
          },
          consumer: {
            groupId: 'order-consumer',
          },
        },
      },
    ]),
    PrismaModule,
    ScheduleModule.forRoot()
  ],
  controllers: [HealthController, OrderController, OrderEventsController],
  providers: [OrderService, OutboxPublisher],
})

// @Module({
//   imports: [PrismaModule, HttpModule],
//   controllers: [OrderController],
//   providers: [OrderService],
// })
export class OrderModule {}