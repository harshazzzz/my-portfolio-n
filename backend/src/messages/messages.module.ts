import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from '../auth/auth.module.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { MessagesController } from './messages.controller.js';
import { MessagesService } from './messages.service.js';
@Module({
  imports: [AuthModule, ThrottlerModule.forRoot([{ ttl: 60000, limit: 5 }])],
  controllers: [MessagesController],
  providers: [MessagesService, PrismaService],
})
export class MessagesModule {}
