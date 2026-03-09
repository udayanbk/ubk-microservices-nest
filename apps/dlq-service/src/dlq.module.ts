import { Module } from "@nestjs/common";
import { DlqService } from "./dlq.service";
import { DlqEventsController } from "./dlq.events.controller";
import { HealthController } from "./health.controller";

@Module({
  controllers: [HealthController, DlqEventsController],
  providers: [DlqService],
})
export class DlqModule {}