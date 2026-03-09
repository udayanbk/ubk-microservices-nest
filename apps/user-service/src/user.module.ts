import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaModule } from '@ecom/database/prisma.module';
import { HealthController } from './health.controller';

@Module({
  imports: [PrismaModule],
  controllers: [UserController, HealthController],
  providers: [UserService],
})
export class UserModule {}
