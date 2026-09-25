import { PasswordResetService } from './password-reset.service.js';
import { ResetMailService } from './reset-mail.service.js';
import { ConfigService } from '@nestjs/config';
import { AppConfigModule } from '../config/config.module.js';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { JwtStrategy } from './jwt.strategy.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { PrismaService } from '../prisma/prisma.service.js';
@Module({
  imports: [
    AppConfigModule,
    PassportModule,
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 5 }]),
    JwtModule.registerAsync({
      imports: [AppConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const secret = config.getOrThrow<string>('JWT_SECRET');
        return {
          secret,
          signOptions: {
            algorithm: 'HS256',
            expiresIn: config.getOrThrow<number>('JWT_EXPIRES_SECONDS'),
            issuer: 'harsha-cms',
            audience: 'harsha-admin',
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    PasswordResetService,
    ResetMailService,
    AuthService,
    JwtStrategy,
    JwtAuthGuard,
    PrismaService,
  ],
  exports: [JwtAuthGuard],
})
export class AuthModule {}
