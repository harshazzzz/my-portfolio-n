import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { BlogsController } from './blogs.controller.js';
import { BlogsService } from './blogs.service.js';
@Module({
  imports: [AuthModule],
  controllers: [BlogsController],
  providers: [BlogsService, PrismaService],
})
export class BlogsModule {}
