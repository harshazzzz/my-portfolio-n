import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { hash } from 'bcrypt';
const password = process.env.ADMIN_SEED_PASSWORD || 'ChangeMe123!';
if (
  process.env.NODE_ENV === 'production' &&
  (!process.env.ADMIN_SEED_PASSWORD || password === 'ChangeMe123!')
) {
  throw new Error(
    'Set a unique ADMIN_SEED_PASSWORD before seeding production.',
  );
}
if (password.length < 12 && password !== 'ChangeMe123!')
  throw new Error('Use at least 12 characters.');
if (Buffer.byteLength(password, 'utf8') > 72)
  throw new Error('Password exceeds bcrypt maximum of 72 bytes.');
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required.');
const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});
try {
  const email = (process.env.ADMIN_SEED_EMAIL || 'admin@harsha.dev')
    .trim()
    .toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log('Account already exists; password and role were not changed.');
  } else {
    await prisma.user.create({
      data: {
        email,
        password: await hash(password, 12),
        name: 'Harsha',
        role: 'ADMIN',
      },
    });
    console.log(
      'Admin created. Change the development password before deployment.',
    );
  }
} finally {
  await prisma.$disconnect();
}
