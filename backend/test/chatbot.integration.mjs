import 'reflect-metadata';
import assert from 'node:assert/strict';
import { Test } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import { ChatbotModule } from '../dist/chatbot/chatbot.module.js';
const module = await Test.createTestingModule({
  imports: [ChatbotModule],
}).compile();
const app = module.createNestApplication();
app.useGlobalPipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }),
);
try {
  await app.listen(0, '127.0.0.1');
  const base = await app.getUrl();
  const send = (body) =>
    fetch(base + '/chatbot/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  for (const [message, expected] of [
    ['Tell me about Wadiya POS', 'MongoDB'],
    ['What is his education?', 'NIBM'],
    ['AutoCare', 'Flutter'],
    ['Library Management System', 'MySQL'],
    ['experience', 'no professional employment'],
    ['quantum physics', 'do not have that information'],
  ]) {
    const response = await send({ message });
    assert.equal(response.status, 201);
    assert.match((await response.json()).answer, new RegExp(expected));
  }
  for (const body of [
    { message: '' },
    { message: '   ' },
    { message: 42 },
    { message: 'a'.repeat(1001) },
    { message: 'Hi', role: 'admin' },
  ])
    assert.equal((await send(body)).status, 400);
  let limited = false;
  for (let i = 0; i < 21; i++) {
    if ((await send({ message: 'Hello' })).status === 429) {
      limited = true;
      break;
    }
  }
  assert.equal(limited, true, 'Public chatbot must rate limit requests');
  console.log(
    'PASS: portfolio answers, unknown-topic fallback, input validation, and rate limiting.',
  );
} finally {
  await app.close();
}
