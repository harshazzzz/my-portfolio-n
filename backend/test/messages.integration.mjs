import 'reflect-metadata';
import 'dotenv/config';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { Test } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MessagesModule } from '../dist/messages/messages.module.js';
import { PrismaService } from '../dist/prisma/prisma.service.js';
const mod = await Test.createTestingModule({
  imports: [MessagesModule],
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
const marker = 'inbox-test-' + randomUUID();
let user;
try {
  await app.listen(0, '127.0.0.1');
  const base = await app.getUrl();
  const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  assert.ok(admin, 'Seed an admin first');
  const jwt = mod.get(JwtService);
  const token = await jwt.signAsync({
    sub: admin.id,
    role: 'ADMIN',
    ver: admin.tokenVersion,
  });
  const req = (path, method = 'GET', body, auth = false) =>
    fetch(base + path, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(auth ? { Authorization: 'Bearer ' + token } : {}),
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
  const input = {
    name: ' Test Sender ',
    email: 'CONTACT-TEST@example.invalid',
    subject: marker,
    message: 'First line.\n<script>alert("test")</script>',
  };
  assert.equal((await req('/messages')).status, 401);
  assert.equal(
    (await req('/messages', 'POST', { ...input, email: 'bad' })).status,
    400,
  );
  assert.equal(
    (await req('/messages', 'POST', { ...input, message: '   ' })).status,
    400,
  );
  assert.equal(
    (await req('/messages', 'POST', { ...input, status: 'READ' })).status,
    400,
  );
  const created = await req('/messages', 'POST', input);
  assert.equal(created.status, 201);
  assert.deepEqual(await created.json(), { success: true });
  const stored = await prisma.message.findFirstOrThrow({
    where: { subject: marker },
  });
  assert.equal(stored.name, 'Test Sender');
  assert.equal(stored.email, 'contact-test@example.invalid');
  assert.equal(stored.status, 'UNREAD');
  assert.equal((await req('/messages/' + stored.id)).status, 401);
  assert.equal(
    (await req('/messages/' + stored.id + '/read', 'PATCH')).status,
    401,
  );
  assert.equal((await req('/messages/' + stored.id, 'DELETE')).status, 401);
  user = await prisma.user.create({
    data: {
      email: marker + '@example.invalid',
      password: 'not-a-login-hash',
      role: 'USER',
    },
  });
  const denied = await jwt.signAsync({ sub: user.id, role: 'ADMIN', ver: 0 });
  assert.equal(
    (
      await fetch(base + '/messages', {
        headers: { Authorization: 'Bearer ' + denied },
      })
    ).status,
    401,
  );
  const list = await req('/messages', 'GET', undefined, true);
  assert.equal(list.status, 200);
  assert.ok((await list.json()).some((m) => m.id === stored.id));
  const detail = await req('/messages/' + stored.id, 'GET', undefined, true);
  assert.equal(detail.status, 200);
  assert.equal((await detail.json()).message, input.message);
  assert.equal(
    (await prisma.message.findUniqueOrThrow({ where: { id: stored.id } }))
      .status,
    'UNREAD',
    'Viewing does not change status',
  );
  for (let i = 0; i < 2; i++) {
    const read = await req(
      '/messages/' + stored.id + '/read',
      'PATCH',
      undefined,
      true,
    );
    assert.equal(read.status, 200);
    assert.equal((await read.json()).status, 'READ');
  }
  assert.equal(
    (await req('/messages', 'POST', { ...input, name: '' })).status,
    400,
  );
  assert.equal((await req('/messages', 'POST', input)).status, 429);
  assert.equal(
    (await req('/messages/no-uuid', 'GET', undefined, true)).status,
    400,
  );
  assert.equal(
    (await req('/messages/' + randomUUID(), 'GET', undefined, true)).status,
    404,
  );
  assert.equal(
    (await req('/messages/' + stored.id, 'DELETE', undefined, true)).status,
    200,
  );
  assert.equal(
    (await req('/messages/' + stored.id, 'DELETE', undefined, true)).status,
    404,
  );
  console.log(
    'PASS: public submission, validation, normalized email, unread default, private list/detail, non-admin denial, idempotent read action, rate limiting, UUID/404 handling, and deletion.',
  );
} finally {
  await prisma.message.deleteMany({ where: { subject: marker } });
  if (user) await prisma.user.delete({ where: { id: user.id } });
  await app.close();
}
