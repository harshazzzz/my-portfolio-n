import 'reflect-metadata';
import 'dotenv/config';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { Test } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BlogsModule } from '../dist/blogs/blogs.module.js';
import { PrismaService } from '../dist/prisma/prisma.service.js';
const mod = await Test.createTestingModule({
  imports: [BlogsModule],
}).compile();
const app = mod.createNestApplication();
app.useGlobalPipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }),
);
const prisma = mod.get(PrismaService);
const ids = [];
let testUser;
try {
  await app.listen(0, '127.0.0.1');
  const base = await app.getUrl();
  const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  assert.ok(admin, 'Seed an admin first.');
  const jwt = mod.get(JwtService);
  const token = await jwt.signAsync({
    sub: admin.id,
    role: 'ADMIN',
    ver: admin.tokenVersion,
  });
  const req = (path, method = 'GET', body, auth = true) =>
    fetch(base + path, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(auth ? { Authorization: 'Bearer ' + token } : {}),
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
  const slug = 'cms-test-' + randomUUID();
  const input = {
    title: 'CMS integration test',
    slug,
    excerpt: 'Temporary test article.',
    content: 'First paragraph.\n\nSecond paragraph.',
    coverImage: '',
    category: 'Testing',
    tags: ['Test'],
    status: 'DRAFT',
  };
  assert.equal((await req('/blogs', 'POST', input, false)).status, 401);
  assert.equal(
    (await req('/blogs/admin/all', 'GET', undefined, false)).status,
    401,
  );
  testUser = await prisma.user.create({
    data: {
      email: slug + '@example.invalid',
      password: 'not-a-valid-login-hash',
      role: 'USER',
    },
  });
  const userToken = await jwt.signAsync({
    sub: testUser.id,
    role: 'ADMIN',
    ver: 0,
  });
  assert.equal(
    (
      await fetch(base + '/blogs/admin/all', {
        headers: { Authorization: 'Bearer ' + userToken },
      })
    ).status,
    401,
  );
  assert.equal(
    (await req('/blogs', 'POST', { ...input, slug: 'Invalid Slug' })).status,
    400,
  );
  assert.equal(
    (
      await req('/blogs', 'POST', {
        ...input,
        coverImage: 'javascript:alert(1)',
      })
    ).status,
    400,
  );
  const created = await req('/blogs', 'POST', input);
  assert.equal(created.status, 201);
  const blog = await created.json();
  ids.push(blog.id);
  assert.equal(blog.publishedAt, null);
  assert.equal(
    (await req('/blogs/' + slug, 'GET', undefined, false)).status,
    404,
  );
  assert.ok(
    !(await (await req('/blogs', 'GET', undefined, false)).json()).some(
      (b) => b.id === blog.id,
    ),
  );
  assert.ok(
    (await (await req('/blogs/admin/all')).json()).some(
      (b) => b.id === blog.id,
    ),
  );
  assert.equal((await req('/blogs', 'POST', input)).status, 409);
  assert.equal(
    (await req('/blogs/' + blog.id, 'PATCH', { title: null })).status,
    400,
  );
  assert.equal(
    (
      await req('/blogs/' + blog.id, 'PATCH', {
        publishedAt: new Date().toISOString(),
      })
    ).status,
    400,
  );
  const pub = await req('/blogs/' + blog.id, 'PATCH', {
    status: 'PUBLISHED',
    title: 'Published CMS test',
  });
  assert.equal(pub.status, 200);
  const published = await pub.json();
  assert.ok(published.publishedAt);
  assert.equal(
    (await req('/blogs/' + slug, 'GET', undefined, false)).status,
    200,
  );
  const edit = await (
    await req('/blogs/' + blog.id, 'PATCH', { excerpt: 'Updated excerpt' })
  ).json();
  assert.equal(edit.publishedAt, published.publishedAt);
  assert.equal(
    (await req('/blogs/' + blog.id, 'PATCH', { status: 'DRAFT' })).status,
    200,
  );
  assert.equal(
    (await req('/blogs/' + slug, 'GET', undefined, false)).status,
    404,
  );
  assert.equal(
    (await req('/blogs/' + blog.id, 'DELETE', undefined, false)).status,
    401,
  );
  assert.equal((await req('/blogs/' + blog.id, 'DELETE')).status, 200);
  assert.equal((await req('/blogs/' + blog.id, 'DELETE')).status, 404);
  assert.equal((await req('/blogs/not-a-uuid', 'PATCH', {})).status, 400);
  console.log(
    'PASS: real PostgreSQL CRUD, admin authorization, draft privacy, publication timestamps, unpublishing, validation, duplicate slug conflicts, and deletion.',
  );
} finally {
  if (ids.length) await prisma.blog.deleteMany({ where: { id: { in: ids } } });
  if (testUser) await prisma.user.delete({ where: { id: testUser.id } });
  await app.close();
}
