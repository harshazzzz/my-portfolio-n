import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
const origin = process.env.TEST_FRONTEND_URL ?? 'http://localhost:3000';
const input = {
  name: 'Inbox verification',
  email: 'verification@example.invalid',
  subject: 'contact-verify-' + randomUUID(),
  message: '<script>alert("test")</script>\nSecond line.',
};
const contact = await fetch(origin + '/contact');
assert.equal(contact.status, 200);
assert.ok((await contact.text()).includes('Send Message'));
const post = (path, body, headers = {}) =>
  fetch(origin + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
assert.equal((await post('/api/messages', input)).status, 403);
assert.equal((await fetch(origin + '/api/admin/messages')).status, 401);
const login = await post(
  '/api/auth/login',
  {
    email: process.env.TEST_ADMIN_EMAIL ?? 'admin@harsha.dev',
    password: process.env.TEST_ADMIN_PASSWORD ?? 'ChangeMe123!',
  },
  { Origin: origin },
);
assert.equal(login.status, 200);
const cookie = login.headers.get('set-cookie').split(';')[0];
const admin = (path, method = 'GET', csrf = origin) =>
  fetch(origin + path, {
    method,
    redirect: 'manual',
    headers: { cookie, Origin: csrf },
  });
let id;
try {
  const sent = await post('/api/messages', input, { Origin: origin });
  assert.equal(sent.status, 201);
  assert.deepEqual(await sent.json(), { success: true });
  const list = await admin('/api/admin/messages');
  assert.equal(list.status, 200);
  const message = (await list.json()).find((m) => m.subject === input.subject);
  assert.ok(message);
  id = message.id;
  assert.equal(message.status, 'UNREAD');
  assert.equal((await admin('/admin/messages')).status, 200);
  const detail = await admin('/api/admin/messages/' + id);
  assert.equal(detail.status, 200);
  assert.equal((await detail.json()).message, input.message);
  assert.equal((await fetch(origin + '/api/admin/messages/' + id)).status, 401);
  assert.equal(
    (
      await admin(
        '/api/admin/messages/' + id + '/read',
        'PATCH',
        'https://attacker.invalid',
      )
    ).status,
    403,
  );
  const read = await admin('/api/admin/messages/' + id + '/read', 'PATCH');
  assert.equal(read.status, 200);
  assert.equal((await read.json()).status, 'READ');
  assert.equal((await admin('/admin/dashboard')).status, 200);
  console.log(
    'PASS: public contact page/submission, stored inbox message, private API, inbox/dashboard pages, CSRF rejection, and mark-as-read.',
  );
} finally {
  if (id) {
    assert.equal(
      (await admin('/api/admin/messages/' + id, 'DELETE')).status,
      200,
    );
    console.log('Temporary message deleted.');
  }
}
