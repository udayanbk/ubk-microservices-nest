import { Injectable, OnModuleInit } from "@nestjs/common";
// import { PrismaClient } from "@prisma/client";
import { PrismaClient } from '../../../generated/main-client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {

  constructor() {

    console.log("🔵 PrismaService constructor");
    console.log("DATABASE_URL =", process.env.DATABASE_URL);

    super();

  }

  async onModuleInit() {

    console.log("🟡 Connecting to database...");

    await this.$connect();

    console.log("🟢 Database connected successfully");

  }

}