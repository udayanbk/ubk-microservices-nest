import { Module } from '@nestjs/common';
import { InventoryServiceController } from './inventory.controller';
import { InventoryServiceService } from './inventory.service';

@Module({
  imports: [],
  controllers: [InventoryServiceController],
  providers: [InventoryServiceService],
})
export class InventoryServiceModule {}
