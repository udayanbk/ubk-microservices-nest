import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../../../generated/logs-client';

@Injectable()
export class PrismaLogsService extends PrismaClient implements OnModuleInit {

  async onModuleInit() {
    await this.$connect();
  }

}