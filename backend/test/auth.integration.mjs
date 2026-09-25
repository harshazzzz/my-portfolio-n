import 'reflect-metadata';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { createServer } from 'node:net';
import { fileURLToPath } from 'node:url';
import { Test } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash } from 'bcrypt';
process.env.JWT_SECRET = randomBytes(48).toString('hex');
process.env.DATABASE_URL = 'postgresql://test:test@127.0.0.1:5432/test';
process.env.JWT_EXPIRES_IN = '30m';
const { AuthModule } = await import('../dist/auth/auth.module.js');
const { PrismaService } = await import('../dist/prisma/prisma.service.js');
const users = [
  {
    id: '11111111-1111-4111-8111-111111111111',
    email: 'admin@harsha.dev',
    password: await hash('ChangeMe123!', 12),
    role: 'ADMIN',
    name: 'Harsha',
    tokenVersion: 0,
  },
  {
    id: '22222222-2222-4222-8222-222222222222',
    email: 'user@harsha.dev',
    password: await hash('UserPassword123!', 12),
    role: 'USER',
    name: 'User',
    tokenVersion: 0,
  },
];
const prisma = {
  user: {
    findUnique: async ({ where }) =>
      users.find((u) =>
        where.email ? u.email === where.email : u.id === where.id,
      ) ?? null,
    update: async ({ where }) => {
      const u = users.find((u) => u.id === where.id);
      u.tokenVersion++;
      return u;
    },
  },
};
const module = await Test.createTestingModule({ imports: [AuthModule] })
  .overrideProvider(PrismaService)
  .useValue(prisma)
  .compile();
const app = module.createNestApplication();
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
);
await app.listen(0, '127.0.0.1');
const backend = await app.getUrl();
const post = (url, body, headers = {}) =>
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
    redirect: 'manual',
  });
let child;
try {
  assert.equal(
    (await post(backend + '/auth/login', { email: 'bad', password: 'x' }))
      .status,
    400,
  );
  assert.equal(
    (
      await post(backend + '/auth/login', {
        email: 'missing@harsha.dev',
        password: 'wrong',
      })
    ).status,
    401,
  );
  assert.equal(
    (
      await post(backend + '/auth/login', {
        email: 'admin@harsha.dev',
        password: 'wrong',
      })
    ).status,
    401,
  );
  assert.equal(
    (
      await post(backend + '/auth/login', {
        email: 'user@harsha.dev',
        password: 'UserPassword123!',
      })
    ).status,
    401,
  );
  const good = await post(backend + '/auth/login', {
    email: ' ADMIN@HARSHA.DEV ',
    password: 'ChangeMe123!',
  });
  assert.equal(good.status, 200);
  const data = await good.json();
  assert.equal(data.user.role, 'ADMIN');
  assert.equal(data.expiresIn, 1800);
  const claims = module.get(JwtService).decode(data.accessToken);
  assert.equal(claims.exp - claims.iat, 1800);
  assert.equal(data.user.password, undefined);
  const headers = { Authorization: 'Bearer ' + data.accessToken };
  assert.equal((await fetch(backend + '/auth/me', { headers })).status, 200);
  assert.equal((await fetch(backend + '/auth/me')).status, 401);
  assert.equal(
    (
      await fetch(backend + '/auth/me', {
        headers: { Authorization: 'Bearer forged' },
      })
    ).status,
    401,
  );
  const jwt = module.get(JwtService);
  const expired = await jwt.signAsync(
    { sub: users[0].id, role: 'ADMIN', ver: 0 },
    { expiresIn: -10 },
  );
  assert.equal(
    (
      await fetch(backend + '/auth/me', {
        headers: { Authorization: 'Bearer ' + expired },
      })
    ).status,
    401,
  );
  users[0].role = 'USER';
  assert.equal((await fetch(backend + '/auth/me', { headers })).status, 401);
  users[0].role = 'ADMIN';
  assert.equal(
    (
      await post(backend + '/auth/login', {
        email: 'admin@harsha.dev',
        password: 'ChangeMe123!',
      })
    ).status,
    429,
  );
  // Fresh limiter bucket for the browser flow, without weakening the actual guard.
  const { ThrottlerStorage } = await import('@nestjs/throttler');
  module.get(ThrottlerStorage).onApplicationShutdown();
  const listener = createServer();
  listener.listen(0, '127.0.0.1');
  await once(listener, 'listening');
  const port = listener.address().port;
  await new Promise((r) => listener.close(r));
  const origin = 'http://127.0.0.1:' + port;
  child = spawn(
    process.execPath,
    [
      'node_modules/next/dist/bin/next',
      'start',
      '--hostname',
      '127.0.0.1',
      '--port',
      String(port),
    ],
    {
      cwd: fileURLToPath(new URL('../../frontend', import.meta.url)),
      env: {
        ...process.env,
        BACKEND_URL: backend,
        NEXT_TELEMETRY_DISABLED: '1',
      },
      windowsHide: true,
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  );
  let output = '';
  child.stdout.on('data', (d) => (output += d));
  child.stderr.on('data', (d) => (output += d));
  let ready = false;
  for (let i = 0; i < 100; i++) {
    if (child.exitCode !== null) throw Error(output);
    try {
      if ((await fetch(origin + '/admin/login')).status === 200) {
        ready = true;
        break;
      }
    } catch {}
    await new Promise((r) => setTimeout(r, 200));
  }
  assert.ok(ready, output);
  const paths = [
    'dashboard',
    'blogs',
    'projects',
    'skills',
    'education',
    'experience',
    'settings',
    'messages',
  ];
  for (const p of paths) {
    const r = await fetch(origin + '/admin/' + p, { redirect: 'manual' });
    assert.equal(r.status, 307);
    assert.equal(
      new URL(r.headers.get('location'), origin).pathname,
      '/admin/login',
    );
  }
  assert.match(await (await fetch(origin + '/admin/login')).text(), /Sign In/);
  assert.equal(
    (
      await post(origin + '/api/auth/login', {
        email: 'admin@harsha.dev',
        password: 'ChangeMe123!',
      })
    ).status,
    403,
  );
  const response = await post(
    origin + '/api/auth/login',
    { email: 'admin@harsha.dev', password: 'ChangeMe123!' },
    { Origin: origin },
  );
  assert.equal(response.status, 200);
  const cookieHeader = response.headers.get('set-cookie');
  assert.match(cookieHeader, /HttpOnly/i);
  assert.match(cookieHeader, /SameSite=strict/i);
  assert.match(cookieHeader, /Secure/i);
  const cookie = cookieHeader.split(';')[0];
  for (const p of paths) {
    const r = await fetch(origin + '/admin/' + p, {
      headers: { cookie },
      redirect: 'manual',
    });
    assert.equal(r.status, 200, p);
    const html = await r.text();
    if (p === 'blogs') assert.match(html, /Blog workspace/);
    else if (p === 'projects') assert.match(html, /Project workspace/);
    else if (p !== 'messages') assert.match(html, /admin@harsha.dev/);
    if (p === 'dashboard') assert.match(html, /Authentication successful/);
  }
  const me = await (
    await fetch(origin + '/api/auth/me', { headers: { cookie } })
  ).json();
  assert.equal(me.user.role, 'ADMIN');
  assert.equal(me.user.password, undefined);
  const forged = await fetch(origin + '/admin/dashboard', {
    headers: { cookie: 'harsha_admin_token=forged' },
    redirect: 'manual',
  });
  assert.equal(forged.status, 307);
  assert.equal(
    (
      await post(
        origin + '/api/auth/logout',
        {},
        { cookie, Origin: 'https://attacker.example' },
      )
    ).status,
    403,
  );
  const logout = await post(
    origin + '/api/auth/logout',
    {},
    { cookie, Origin: origin },
  );
  assert.equal(logout.status, 200);
  assert.match(logout.headers.get('set-cookie'), /Max-Age=0/i);
  assert.equal((await fetch(backend + '/auth/me', { headers })).status, 401);
  assert.equal(
    (await fetch(origin + '/api/auth/me', { headers: { cookie } })).status,
    401,
  );
  assert.equal(
    (
      await fetch(origin + '/admin/dashboard', {
        headers: { cookie },
        redirect: 'manual',
      })
    ).status,
    307,
  );
  assert.equal((await fetch(origin + '/api/auth/providers')).status, 404);
  console.log(
    'PASS: credentials, validation, roles, JWT tampering/expiry, rate limiting, frontend login/cookies, eight protected routes, CSRF checks, session restore, and logout revocation. Database uses an in-memory Prisma test double.',
  );
} finally {
  if (child) {
    child.kill();
    if (child.exitCode === null) await once(child, 'exit');
  }
  await app.close();
}
