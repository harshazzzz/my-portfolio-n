import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import type { CreateProjectDto } from './dto/create-project.dto.js';
import type { UpdateProjectDto } from './dto/update-project.dto.js';
@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}
  all() {
    return this.prisma.project.findMany({ orderBy: { updatedAt: 'desc' } });
  }
  published() {
    return this.prisma.project.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: [
        { featured: 'desc' },
        { sortOrder: 'asc' },
        { createdAt: 'desc' },
      ],
    });
  }
  async bySlug(slug: string) {
    const project = await this.prisma.project.findFirst({
      where: { slug, status: 'PUBLISHED' },
    });
    if (!project) throw new NotFoundException('Project not found.');
    return project;
  }
  private fail(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002')
        throw new ConflictException('This slug is already used.');
      if (error.code === 'P2025')
        throw new NotFoundException('Project not found.');
    }
    throw error;
  }
  async create(d: CreateProjectDto) {
    try {
      return await this.prisma.project.create({
        data: {
          title: d.title,
          slug: d.slug,
          category: d.category,
          shortDescription: d.shortDescription,
          description: d.description,
          coverImage: d.coverImage,
          images: d.images,
          technologies: d.technologies,
          githubUrl: d.githubUrl,
          liveUrl: d.liveUrl,
          featured: d.featured,
          status: d.status,
          role: d.role ?? '',
          features: d.features ?? [],
          benefits: d.benefits ?? [],
        },
      });
    } catch (e) {
      return this.fail(e);
    }
  }
  async update(id: string, d: UpdateProjectDto) {
    try {
      return await this.prisma.project.update({
        where: { id },
        data: {
          title: d.title,
          slug: d.slug,
          category: d.category,
          shortDescription: d.shortDescription,
          description: d.description,
          coverImage: d.coverImage,
          images: d.images,
          technologies: d.technologies,
          githubUrl: d.githubUrl,
          liveUrl: d.liveUrl,
          featured: d.featured,
          status: d.status,
          role: d.role,
          features: d.features,
          benefits: d.benefits,
        },
      });
    } catch (e) {
      return this.fail(e);
    }
  }
  async remove(id: string) {
    try {
      await this.prisma.project.delete({ where: { id } });
      return { success: true };
    } catch (e) {
      return this.fail(e);
    }
  }
}
