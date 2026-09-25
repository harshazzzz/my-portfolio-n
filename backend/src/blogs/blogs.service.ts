import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import type { CreateBlogDto } from './dto/create-blog.dto.js';
import type { UpdateBlogDto } from './dto/update-blog.dto.js';
@Injectable()
export class BlogsService {
  constructor(private readonly prisma: PrismaService) {}
  listAdmin() {
    return this.prisma.blog.findMany({ orderBy: { updatedAt: 'desc' } });
  }
  listPublic() {
    return this.prisma.blog.findMany({
      where: { status: 'PUBLISHED', publishedAt: { lte: new Date() } },
      orderBy: { publishedAt: 'desc' },
    });
  }
  async bySlug(slug: string) {
    const blog = await this.prisma.blog.findFirst({
      where: { slug, status: 'PUBLISHED', publishedAt: { lte: new Date() } },
    });
    if (!blog) throw new NotFoundException('Article not found.');
    return blog;
  }
  private failure(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002')
        throw new ConflictException(
          'This slug is already used. Choose another slug.',
        );
      if (error.code === 'P2025')
        throw new NotFoundException('Blog not found.');
    }
    throw error;
  }
  async create(dto: CreateBlogDto) {
    try {
      return await this.prisma.blog.create({
        data: {
          title: dto.title,
          slug: dto.slug,
          excerpt: dto.excerpt,
          content: dto.content,
          coverImage: dto.coverImage,
          category: dto.category,
          tags: dto.tags,
          status: dto.status,
          publishedAt: dto.status === 'PUBLISHED' ? new Date() : null,
        },
      });
    } catch (error) {
      return this.failure(error);
    }
  }
  async update(id: string, dto: UpdateBlogDto) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const current = await tx.blog.findUnique({ where: { id } });
        if (!current) throw new NotFoundException('Blog not found.');
        const status = dto.status ?? current.status;
        return tx.blog.update({
          where: { id },
          data: {
            title: dto.title,
            slug: dto.slug,
            excerpt: dto.excerpt,
            content: dto.content,
            coverImage: dto.coverImage,
            category: dto.category,
            tags: dto.tags,
            status: dto.status,
            publishedAt:
              status === 'PUBLISHED'
                ? (current.publishedAt ?? new Date())
                : null,
          },
        });
      });
    } catch (error) {
      return this.failure(error);
    }
  }
  async remove(id: string) {
    try {
      await this.prisma.blog.delete({ where: { id } });
      return { success: true };
    } catch (error) {
      return this.failure(error);
    }
  }
}
