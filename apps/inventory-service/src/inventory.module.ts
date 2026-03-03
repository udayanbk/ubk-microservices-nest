import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { PrismaModule } from "@ecom/database";
import { InventoryController } from "./inventory.controller";
import { InventoryService } from "./inventory.service";
import { InventoryEventsController } from "./inventory.events.controller";

@Module({
  imports: [
    PrismaModule,
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: [process.env.KAFKA_BROKER!],
          },
          consumer: {
            groupId: "inventory-consumer",
          },
        },
      },
    ]),
  ],
  controllers: [
    InventoryController,
    InventoryEventsController
  ],
  providers: [InventoryService],
})
export class InventoryModule {}