import { readFileSync } from 'node:fs';
import { parse } from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

// Run manually after migrations. Never overwrite a populated production database.
const local = parse(readFileSync(new URL('../.env', import.meta.url)));
const production = parse(readFileSync(new URL('../.env.production.local', import.meta.url)));
const sourceUrl = local.DATABASE_URL;
const targetUrl = production.DATABASE_URL;
if (!sourceUrl || !targetUrl || sourceUrl === targetUrl)
  throw new Error('Separate source and production DATABASE_URL values are required.');
const sourceHost = new URL(sourceUrl).hostname;
const targetHost = new URL(targetUrl).hostname;
if (!['localhost', '127.0.0.1', '[::1]'].includes(sourceHost) || !targetHost.endsWith('.neon.tech'))
  throw new Error('This migration only supports the local database to the hosted Neon database.');

const source = new PrismaClient({ adapter: new PrismaPg({ connectionString: sourceUrl }) });
const target = new PrismaClient({ adapter: new PrismaPg({ connectionString: targetUrl }) });
try {
  const models = ['user', 'project', 'blog', 'message'];
  const counts = await Promise.all(models.map((model) => target[model].count()));
  if (counts.some(Boolean)) throw new Error('Target database is not empty; no records were changed.');
  const [users, projects, blogs, messages] = await source.$transaction([
    source.user.findMany(), source.project.findMany(), source.blog.findMany(), source.message.findMany(),
  ]);
  await target.$transaction(async (tx) => {
    if (users.length) await tx.user.createMany({ data: users.map((user) => ({
      ...user, tokenVersion: user.tokenVersion + 1,
      resetTokenHash: null, resetExpiresAt: null, resetRequestedAt: null,
    })) });
    if (projects.length) await tx.project.createMany({ data: projects });
    if (blogs.length) await tx.blog.createMany({ data: blogs });
    if (messages.length) await tx.message.createMany({ data: messages });
  }, { timeout: 30000 });
  console.log(JSON.stringify({ copied: { users: users.length, projects: projects.length, blogs: blogs.length, messages: messages.length } }));
} finally {
  await Promise.all([source.$disconnect(), target.$disconnect()]);
}
