import { Module } from '@nestjs/common';
import { RetryController } from './retry.controller';
// import { RetryService } from './retry.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: [process.env.KAFKA_BROKER || 'localhost: 9092']
          },
          consumer: {
            groupId: "retry-consumer"
          }
        }
      }
    ])
  ],
  controllers: [RetryController]
})
export class RetryModule {}