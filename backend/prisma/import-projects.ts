import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { projects } from '../../frontend/src/data/projects.ts';
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required.');
const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});
try {
  const result = await prisma.project.createMany({
    skipDuplicates: true,
    data: projects.map((p, index) => ({
      title: p.title,
      slug: p.id,
      category: p.category,
      shortDescription: p.description,
      description: p.introduction,
      coverImage: p.image ?? '',
      images: [],
      technologies: [...p.technologies],
      githubUrl: p.githubUrl ?? '',
      liveUrl: p.demoUrl ?? '',
      featured: p.featured ?? false,
      status: 'PUBLISHED',
      role: p.role,
      features: [...p.features],
      benefits: [...p.benefits],
      accent: p.accent,
      preview: p.preview,
      sortOrder: index,
    })),
  });
  console.log(
    'Imported ' +
      result.count +
      ' existing projects. Matching slugs were preserved without modification.',
  );
} finally {
  await prisma.$disconnect();
}
