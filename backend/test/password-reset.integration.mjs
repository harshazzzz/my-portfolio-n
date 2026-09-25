import { AppConfigModule } from '../dist/config/config.module.js';
import 'reflect-metadata';
import 'dotenv/config';
import assert from 'node:assert/strict';
import { randomUUID, createHash } from 'node:crypto';
import { Test } from '@nestjs/testing';
import { compare } from 'bcrypt';
import { PasswordResetService } from '../dist/auth/password-reset.service.js';
import { ResetMailService } from '../dist/auth/reset-mail.service.js';
import { PrismaService } from '../dist/prisma/prisma.service.js';
const sent = [];
const mod = await Test.createTestingModule({ imports: [AppConfigModule], providers: [PasswordResetService, PrismaService, { provide: ResetMailService, useValue: { settings() {}, async send(email, token) { sent.push({email,token}); } } }] }).compile();
const db=mod.get(PrismaService), service=mod.get(PasswordResetService);
const email='reset-test-'+randomUUID()+'@example.com';
try {
 const user=await db.user.create({data:{email, role:'ADMIN', password:'test-only-no-login'}});
 const valid=await service.request(email), unknown=await service.request('missing-'+email);assert.deepEqual(valid,unknown);assert.equal(sent.length,1);
 let stored=await db.user.findUniqueOrThrow({where:{id:user.id}});assert.equal(stored.resetTokenHash,createHash('sha256').update(sent[0].token).digest('hex'));assert.notEqual(stored.resetTokenHash,sent[0].token);
 await service.request(email);assert.equal(sent.length,1,'Cooldown prevents repeated email');
 const password='Test-only-'+randomUUID();
 const results=await Promise.allSettled([service.reset(sent[0].token,password),service.reset(sent[0].token,password)]);assert.equal(results.filter(r=>r.status==='fulfilled').length,1,'Only one concurrent reset succeeds');
 stored=await db.user.findUniqueOrThrow({where:{id:user.id}});assert.ok(await compare(password,stored.password));assert.equal(stored.tokenVersion,1);assert.equal(stored.resetTokenHash,null);
 await assert.rejects(service.reset(sent[0].token,password));
 await db.user.update({where:{id:user.id},data:{resetRequestedAt:null}});await service.request(email);
 await db.user.update({where:{id:user.id},data:{resetExpiresAt:new Date(0)}});await assert.rejects(service.reset(sent[1].token,password));
 await assert.rejects(service.reset(sent[1].token,'a'.repeat(73)));
 console.log('PASS: generic responses, hashed tokens, cooldown, atomic single use, expiry, bcrypt password, and session revocation. No real email sent.');
} finally {await db.user.deleteMany({where:{email}});await mod.close();}
