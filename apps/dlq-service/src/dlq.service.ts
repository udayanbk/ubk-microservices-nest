import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class DlqService {

  private prisma = new PrismaClient();

  async saveEvent(payload: any) {

    console.log("🗄 Saving DLQ event to DB");

    await this.prisma.dlqEvent.create({
      data: {
        topic: payload.topic,
        payload: payload.payload,
        error: payload.error,
        service: payload.service
      }
    });

    console.log("✅ DLQ event stored");

  }
}