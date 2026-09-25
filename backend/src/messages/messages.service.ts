import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import type { CreateMessageDto } from './dto/create-message.dto.js';
@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}
  async create(dto: CreateMessageDto) {
    await this.prisma.message.create({
      data: {
        name: dto.name,
        email: dto.email,
        subject: dto.subject,
        message: dto.message,
      },
    });
    return { success: true };
  }
  all() {
    return this.prisma.message.findMany({
      orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
    });
  }
  async one(id: string) {
    const message = await this.prisma.message.findUnique({ where: { id } });
    if (!message) throw new NotFoundException('Message not found.');
    return message;
  }
  private fail(error: unknown): never {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    )
      throw new NotFoundException('Message not found.');
    throw error;
  }
  async read(id: string) {
    try {
      return await this.prisma.message.update({
        where: { id },
        data: { status: 'READ' },
      });
    } catch (error) {
      return this.fail(error);
    }
  }
  async remove(id: string) {
    try {
      await this.prisma.message.delete({ where: { id } });
      return { success: true };
    } catch (error) {
      return this.fail(error);
    }
  }
}
