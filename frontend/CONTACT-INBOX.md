# Contact form and admin inbox

Public page: /contact. The existing Contact navbar action opens it. Admin inbox: /admin/messages (the existing protected route group keeps this URL unchanged).

## Flow

Visitors submit name, email, subject, and message. Next.js POST /api/messages validates the shape and origin, then forwards to NestJS POST /messages. The database stores a new UNREAD message. The public response only confirms success, without returning private message records. This implementation stores messages in the inbox; it does not send email notifications.

Admins can search names/emails/subjects/body text, filter read/unread, view full details in the existing accessible Dialog, mark as read, and delete after confirmation. Viewing alone does not mark a message as read. Read is idempotent. Desktop uses a table and mobile uses cards with shared actions. Dashboard message totals and unread counts read the database.

## Links

GitHub uses the existing known account https://github.com/harshazzzz. Configure profile.linkedin and profile.email in src/data/portfolio.ts to show direct LinkedIn and email links. No email address or LinkedIn URL was invented. Until configured, the form is available and the page links to it. This file also controls the existing portfolio social buttons.

## API

Public:
- POST /messages

JWT ADMIN protected:
- GET /messages
- GET /messages/:id
- PATCH /messages/:id/read
- DELETE /messages/:id

Next.js routes: POST /api/messages; GET /api/admin/messages; GET and DELETE /api/admin/messages/:id; PATCH /api/admin/messages/:id/read. Admin routes reuse the existing authenticated forwarding helper and HttpOnly cookie. All mutations enforce same-origin requests at the frontend boundary. Backend authorization rechecks the current database role. Public GET access is denied.

## Validation and privacy

Names: 1-100 characters; valid email up to 254; subjects: 1-160; body: 1-10,000. Whitespace-only values and extra backend fields are rejected. Email is normalized. Status is assigned by the server. Content renders as escaped React text, never raw HTML. No message bodies or sender emails are logged by application code. Private responses use no-store.

Public submission is limited to five attempts per minute per backend-visible IP. Because Next.js forwards requests, visitors through the same server share that conservative limit. Multi-instance deployments need shared throttling storage and trusted proxy configuration before scaling; no untrusted forwarded-IP header is used as an authentication shortcut.

## Database

Already applied locally:

    npm --prefix backend run prisma:generate
    npm --prefix backend run prisma:deploy

Migration: 20260927000000_contact_inbox. No existing users, blogs, or projects were removed. The Message model has UUID id, name, email, subject, message, status (UNREAD/READ, default UNREAD), and createdAt.

## Tests

    npm --prefix backend run test:messages
    npm --prefix backend run test:auth
    npm --prefix frontend run build
    npm --prefix frontend run lint

With both apps running:

    node backend/test/messages.frontend.mjs

The integration tests use temporary records in the configured development database, then delete them. Run only in development. The live frontend test uses the development admin account by default; override TEST_ADMIN_EMAIL, TEST_ADMIN_PASSWORD, and TEST_FRONTEND_URL if needed.

Manual: submit /contact while signed out; check success; sign in and find the message; test search and unread filter; open details; mark as read; switch to read filter; cancel a deletion, then confirm it; check dashboard totals; log out and confirm inbox/API access is denied. Test at 320px and desktop widths. Incorrect fields should preserve entered data, and repeated requests should show a rate-limit error.

## Created files

Backend:
- src/messages/messages.module.ts
- src/messages/messages.controller.ts
- src/messages/messages.service.ts
- src/messages/dto/create-message.dto.ts
- prisma/migrations/20260927000000_contact_inbox/migration.sql
- test/messages.integration.mjs
- test/messages.frontend.mjs

Frontend:
- src/app/contact/page.tsx
- src/components/contact/ContactForm.tsx
- src/components/contact/ContactGlow.tsx
- src/components/contact/contact.module.css (page layout only)
- src/components/admin/messages/MessageTable.tsx
- src/components/admin/messages/MessageCard.tsx
- src/components/admin/messages/MessageDetail.tsx
- src/components/admin/messages/messages.module.css (responsive switching only)
- src/services/message.service.ts
- src/app/api/messages/route.ts
- src/app/api/admin/messages/route.ts
- src/app/api/admin/messages/[id]/route.ts
- src/app/api/admin/messages/[id]/read/route.ts
- CONTACT-INBOX.md

## Modified files

Backend: prisma/schema.prisma, src/app.module.ts, package.json.
Frontend: existing protected messages page and dashboard page, PortfolioExperience.tsx Contact navigation.

Forms, buttons, glass surfaces, cards, gradients and dialogs reuse existing CMS/portfolio styles and components. No new packages or authentication changes were needed.
