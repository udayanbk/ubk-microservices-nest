import { Module } from "@nestjs/common";
import { DlqService } from "./dlq.service";
import { DlqEventsController } from "./dlq.events.controller";

@Module({
  controllers: [DlqEventsController],
  providers: [DlqService],
})
export class DlqModule {}