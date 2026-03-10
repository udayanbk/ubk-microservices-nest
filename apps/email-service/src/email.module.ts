import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { EmailService } from "./email.service";
import { EmailEventsController } from "./email.events.controller";
import { PrismaModule } from "@ecom/database";

@Module({
  imports: [
    PrismaModule,
    ClientsModule.register([
      {
        name: "KAFKA_SERVICE",
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: [process.env.KAFKA_BROKER || "kafka:29092"]
          },
          consumer: {
            groupId: "email-consumer"
          }
        }
      }
    ])
  ],
  providers: [EmailService],
  controllers: [EmailEventsController]
})
export class EmailModule {}