import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hashSync } from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service.js';
import type { LoginDto } from './dto/login.dto.js';
export type AdminUser = {
  id: string;
  email: string;
  name: string | null;
  role: 'ADMIN';
};
// Keep unknown-account checks comparable in cost to a real password check.
const dummyHash = hashSync('not-an-account-password', 12);
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}
  async login(input: LoginDto) {
    if (Buffer.byteLength(input.password, 'utf8') > 72)
      throw new UnauthorizedException('Invalid email or password.');
    const user = await this.prisma.user.findUnique({
      where: { email: input.email.trim().toLowerCase() },
    });
    const valid = await compare(input.password, user?.password ?? dummyHash);
    if (!user || !valid || user.role !== 'ADMIN')
      throw new UnauthorizedException('Invalid email or password.');
    const accessToken = await this.jwt.signAsync({
      sub: user.id,
      role: user.role,
      ver: user.tokenVersion,
    });
    return {
      accessToken,
      expiresIn: this.config.getOrThrow<number>('JWT_EXPIRES_SECONDS'),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }
  async logout(id: string) {
    // Revokes existing JWTs for this account, including copied tokens.
    await this.prisma.user.update({
      where: { id },
      data: { tokenVersion: { increment: 1 } },
    });
    return { success: true };
  }
}
