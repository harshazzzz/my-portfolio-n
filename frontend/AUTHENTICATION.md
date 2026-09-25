# Admin email/password authentication

The portfolio UI is unchanged. NextAuth and Google OAuth have been removed.

## Local setup

1. Start a PostgreSQL database and create a database named harsha_portfolio.
2. Copy backend/.env.example to backend/.env. Set DATABASE_URL and a random JWT_SECRET (at least 32 characters). Generate it with:

   node -e "console.log(require('node:crypto').randomBytes(48).toString('base64url'))"

3. From backend run npm run prisma:generate, npm run prisma:deploy, then npm run prisma:seed.
4. Run npm run start:dev from backend (port 3001).
5. Copy frontend/.env.example to frontend/.env.local, setting NEXT_PUBLIC_API_URL=http://localhost:3001. BACKEND_URL is an optional server-only override.
6. Run npm run dev from frontend. Open http://localhost:3000/admin/login.

Development seed: admin@harsha.dev / ChangeMe123!
Set ADMIN_SEED_EMAIL and ADMIN_SEED_PASSWORD to override these BEFORE the first seed. Existing accounts are never reset or promoted by re-running the seed. Production rejects the default seed password. Use a unique password before deployment; no password-change UI is implemented yet.

The committed migration is applied with npm run prisma:deploy. For future schema changes use npm run prisma:migrate -- --name descriptive_name.

## Flow and security

The browser posts to /api/auth/login on Next.js, which forwards to NestJS POST /auth/login. The backend normalizes email, validates input, compares bcrypt hashes (cost 12), and requires ADMIN. It returns { accessToken, user }. The frontend keeps the token in memory and stores it in an HttpOnly, SameSite=Strict cookie for reloads. It never writes tokens to localStorage. On reload the provider restores user/status via /api/auth/me; its in-memory token is null until a new login.

JWTs use HS256, a fixed issuer/audience, and expire according to JWT_EXPIRES_IN (default 1h). The HttpOnly cookie uses the same lifetime. GET /auth/me checks the current database role and tokenVersion on every request. POST /auth/logout increments tokenVersion, invalidating all existing tokens for the admin, and the frontend clears its cookie. There is no refresh token; log in again after expiry. Login errors deliberately do not disclose whether an account exists. Login is limited to five attempts per minute per backend-visible IP. The same-origin frontend proxy shares a backend-visible IP, so this is a conservative shared limit. Multi-instance deployments need a shared rate-limit store before scaling.

The frontend uses proxy.ts because the installed Next.js version is 16; do not add a conflicting middleware.ts. Server guards also check the backend before protected content renders. The admin route group keeps /admin/dashboard and related URLs unchanged. Every future private backend controller must use JwtAuthGuard; every private Next.js action must call requireAdmin before accessing data. Browser mutations require a matching Origin header. Production must use HTTPS for Secure cookies and HTTPS/private networking between Next.js and NestJS.

Backend endpoints:

- POST /auth/login: email/password; 200 token and user, 400 invalid input, 401 invalid credentials/non-admin, 429 rate limit.
- GET /auth/me: Authorization: Bearer token; returns current admin user.
- POST /auth/logout: Bearer token; revokes all sessions for that account.

## Verification

npm --prefix backend run test:auth runs real Nest HTTP, bcrypt, JWT, and frontend route tests with an in-memory Prisma test double. No production account is used. Build the frontend first. npm --prefix frontend run build and npm --prefix frontend run lint verify the frontend. npm --prefix backend run lint checks the backend.

With PostgreSQL configured, verify the seed password is hashed in the database, log in, reload the dashboard, open every sidebar destination, log out, and try accessing a protected URL again. Test a wrong password and a USER account; neither may receive a token. Run the seed twice to confirm it preserves existing credentials.

The dashboard displays real portfolio data counts, recent articles, and shortcuts. Preview articles are labeled; Messages shows an unavailable state because inbox storage is not connected. Other CMS destinations remain protected placeholders. Editing/uploading content is outside this authentication implementation.

## Dependency audit

The backend npm audit reports advisories in the Prisma dependency tree (including deepmerge-ts and mysql2). The suggested automatic fix downgrades Prisma to 6.x, which is incompatible with this 7.x configuration. No forced downgrade was applied. Review patched Prisma releases before production deployment.

## Files added in this replacement

Backend:

- prisma/schema.prisma
- prisma/seed.ts
- prisma/migrations/migration_lock.toml
- prisma/migrations/20260924000000_admin_auth/migration.sql
- prisma.config.ts
- .env.example
- src/prisma/prisma.service.ts
- src/auth/auth.module.ts
- src/auth/auth.controller.ts
- src/auth/auth.service.ts
- src/auth/jwt.strategy.ts
- src/auth/guards/jwt-auth.guard.ts
- src/auth/dto/login.dto.ts
- test/auth.integration.mjs

Frontend:

- src/lib/api.ts
- src/lib/auth/backend.ts
- src/lib/auth/origin.ts
- src/lib/auth/types.ts
- src/services/auth.service.ts
- src/providers/AuthProvider.tsx
- src/components/auth/LoginForm.tsx
- src/components/admin/AdminHeader.tsx
- src/components/admin/AdminSidebar.tsx
- src/app/admin/layout.tsx
- src/app/admin/(protected)/skills/page.tsx
- src/app/admin/(protected)/education/page.tsx
- src/app/admin/(protected)/experience/page.tsx
- src/app/api/auth/login/route.ts
- src/app/api/auth/me/route.ts
- src/app/api/auth/logout/route.ts

Modified: both package manifests and lockfiles; backend src/app.module.ts, src/main.ts and test/app.e2e-spec.ts; frontend login page, protected admin layout, src/proxy.ts, auth session helper, auth CSS, SignOutButton, ProtectedAdminPage, .env.example, existing local environment (removed only retired provider variables), and this guide. The existing dashboard page still delegates to ProtectedAdminPage.

Removed: NextAuth package, GoogleLoginButton, catch-all OAuth API route, Google allowlist/configuration/policy helpers, NextAuth types, and obsolete OAuth test files.

## Configuration and dashboard fix

The backend now loads backend/.env by absolute module-relative path regardless of the shell working directory. AppConfigModule validates DATABASE_URL, JWT_SECRET (32 characters minimum), JWT_EXPIRES_IN (60 seconds to one day), and PORT. Auth signing, JWT validation, and Prisma use ConfigService. A random local secret was generated in the ignored backend/.env without printing it; .env.example contains no secrets. Existing configured database URLs are preserved.

JWT_EXPIRES_IN accepts 3600, 60m, or 1h. Restart both services after environment changes. The Next.js API forwards login to NEXT_PUBLIC_API_URL, allowing HttpOnly cookies without exposing them to JavaScript storage. BACKEND_URL takes precedence if configured. Next.js 16 uses src/proxy.ts instead of middleware.ts.

PostgreSQL was not reachable during this task (ECONNREFUSED). Migration and seed were NOT applied. Start or provision PostgreSQL, create harsha_portfolio, set DATABASE_URL with your actual database credentials, then run the migration and seed commands above. If port 3001 is already occupied, reuse or restart your existing backend process rather than starting another copy.

Added for this fix: backend/src/config/{config.module.ts,environment.ts,environment.spec.ts}; frontend/src/components/admin/{DashboardCard.tsx,RecentActivity.tsx,dashboard.module.css}; frontend/src/app/admin/(protected)/messages/page.tsx. Updated the existing dashboard page, sidebar/header, API URL settings, JWT expiry/cookie handling, backend configuration consumers, authentication tests, and environment examples. The existing User migration and bcrypt seed are retained.
