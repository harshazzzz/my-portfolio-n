import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { createHash, randomBytes } from 'node:crypto';
import { hash } from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service.js';
import { ResetMailService } from './reset-mail.service.js';
const accepted = {
  message:
    'If that email belongs to an admin account, a reset link will be sent. Please check your inbox and spam folder.',
};
@Injectable()
export class PasswordResetService {
  private readonly logger = new Logger(PasswordResetService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly mail: ResetMailService,
  ) {}
  async request(email: string) {
    this.mail.settings();
    const token = randomBytes(32).toString('hex');
    const digest = createHash('sha256').update(token).digest('hex');
    const now = new Date();
    // Atomic cooldown prevents concurrent requests from repeatedly replacing a link.
    const changed = await this.prisma.user.updateMany({
      where: {
        email,
        role: 'ADMIN',
        OR: [
          { resetRequestedAt: null },
          { resetRequestedAt: { lt: new Date(now.getTime() - 60000) } },
        ],
      },
      data: {
        resetTokenHash: digest,
        resetExpiresAt: new Date(now.getTime() + 15 * 60000),
        resetRequestedAt: now,
      },
    });
    if (changed.count) {
      try {
        await this.mail.send(email, token);
      } catch {
        await this.prisma.user.updateMany({
          where: { resetTokenHash: digest },
          data: { resetTokenHash: null, resetExpiresAt: null },
        });
        this.logger.error(
          'Password reset email could not be delivered. Check email provider configuration.',
        );
      }
    }
    return accepted;
  }
  async reset(token: string, password: string) {
    if (Buffer.byteLength(password, 'utf8') > 72)
      throw new BadRequestException('Password must be at most 72 UTF-8 bytes.');
    const digest = createHash('sha256').update(token).digest('hex');
    const encrypted = await hash(password, 12);
    // Token consumption and session revocation happen in one atomic database update.
    const result = await this.prisma.user.updateMany({
      where: {
        role: 'ADMIN',
        resetTokenHash: digest,
        resetExpiresAt: { gt: new Date() },
      },
      data: {
        password: encrypted,
        resetTokenHash: null,
        resetExpiresAt: null,
        tokenVersion: { increment: 1 },
      },
    });
    if (!result.count)
      throw new BadRequestException(
        'This reset link is invalid or expired. Request a new link.',
      );
    return { message: 'Password updated. Sign in with your new password.' };
  }
}
