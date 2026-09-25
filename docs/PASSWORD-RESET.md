# Admin password recovery

Routes: /admin/forgot-password and /admin/reset-password. The login form has a Forgot password link. Public backend endpoints: POST /auth/forgot-password with {email}, POST /auth/reset-password with {token,password}. The frontend forwards requests through same-origin API routes.

## Enable email delivery

Set backend/.env (or backend hosting environment):
- RESEND_API_KEY: private Resend API key.
- RESET_EMAIL_FROM: a sender address verified with Resend.
- FRONTEND_URL: http://localhost:3000 locally, https://www.harshaz.com in production.

Restart the backend. Email goes only to the existing admin account email. The development admin@harsha.dev address must be replaced with an inbox you control before email recovery is useful; the public contact email is not automatically the admin login email. No real credentials are included and email delivery has not been configured or tested against a real inbox.

Resend API reference: https://resend.com/docs/api-reference/emails/send-email

## Database and tests

From backend: npm run prisma:deploy and npm run prisma:generate. Then npm run build and node test/password-reset.integration.mjs. The integration test uses a temporary admin account and mocked mail delivery, and deletes the test account afterward.

Manual test: click Forgot password, enter the registered admin email, open the email link, enter matching passwords of 12 or more characters, and sign in again. The same reset link must fail a second time; old sessions must no longer work. Test invalid/expired links and mismatched confirmation too.

Tokens contain 32 random bytes, are stored only as SHA-256 hashes, expire in 15 minutes, and are consumed atomically with bcrypt password replacement and tokenVersion increment. Reset requests use a generic response for unknown/non-admin emails, IP throttling and a per-account cooldown. Token URLs use fragments, stripped from the address bar on load; refreshing the reset form requires reopening the email link. No tokens are printed or returned by the API. The mail API currently runs synchronously, so response timing is not guaranteed identical for existing and unknown accounts; a production email queue can remove this timing difference.
