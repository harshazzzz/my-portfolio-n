# Harsha Portfolio: live deployment

Verified on 25 September 2026.

- Portfolio: https://harshaz.vercel.app
- Admin: https://harshaz.vercel.app/admin/login
- Backend: https://harsha-portfolio-api.vercel.app
- Database: existing Neon project fragrant-dream-27213743, production branch.
- Source: https://github.com/harshazzzz/my-portfolio-n

Frontend and backend run on Vercel Hobby. Neon uses the existing Free project. No paid hosting resources were created. Free-plan usage limits still apply. Render is an alternative, not the active backend host.

## Production configuration

Frontend project: harshaz/harsha-portfolio. Deploy from frontend using Node 24.x and the Next.js preset. Build: npm run build. Default output directory. Installed Next.js is 16.3.6; retain src/proxy.ts.

Frontend environment:
- NEXT_PUBLIC_API_URL=https://harsha-portfolio-api.vercel.app
- BACKEND_URL: optional server-only override.
- NEXT_PUBLIC_SITE_URL: optional canonical origin; defaults to the live free domain.

Backend project: harshaz/harsha-portfolio-api. Deploy from backend using the NestJS preset and Node 24.x. backend/vercel.json configures Prisma generation and Singapore runtime placement. NODE_OPTIONS=--experimental-require-module is required for CommonJS dependencies consuming NestJS 12 ESM packages. The entry point must start bootstrap without top-level await to avoid a Vercel initialization deadlock.

Backend environment:
- DATABASE_URL: secret Neon pooled connection URL.
- DIRECT_URL: secret direct connection URL for Prisma migrations.
- JWT_SECRET: secret random value, minimum 32 characters.
- JWT_EXPIRES_IN=1h
- FRONTEND_URL=https://harshaz.vercel.app
- Optional CORS_ORIGINS: additional exact HTTPS origins.
- Optional OBSERVE_APP_KEY and OBSERVE_APP_SECRET: telemetry is disabled unless both exist.

Keep secrets in provider settings and ignored local environment files. Never add them to Git or frontend public variables. .env.example contains names only.

## Database

All five existing migrations were deployed. The existing admin account and all five projects were copied, preserving password hashes. No blog posts or messages existed in the source database. Do not repeat the copy or reset production.

For future migrations, test on an isolated development database or Neon branch first. With the correct production environment loaded, run from backend:

```powershell
npx prisma generate
npx prisma migrate deploy
```

The current admin uses the existing email and password. Do not reseed an existing account unless intentionally changing credentials.

## Redeploy

```powershell
cd backend
npx vercel deploy --prod --yes
cd ../frontend
npx vercel deploy --prod --yes
```

These are CLI-linked projects; a Git push alone does not guarantee redeployment. Review and commit only intended source/config files before pushing main to origin.

## Verified behavior

Both production builds passed. Backend unit tests and frontend ESLint passed. Live checks passed for homepage, projects, blog, contact, admin login, robots, sitemap, unauthenticated dashboard redirect, secure HttpOnly SameSite cookies, authorized dashboard and CMS APIs, assistant responses, and logout. Contact submission, inbox reading, marking read, and deleting the temporary test message passed. No existing project was removed. Visual/mobile and microphone checks still require a real browser.

## Optional remaining services

Password recovery email requires RESEND_API_KEY and RESET_EMAIL_FROM for a verified sender. Login works without these, but reset emails cannot be delivered until configured.

The CMS currently accepts image URLs, including Cloudinary URLs. Cloudinary account credentials and signed uploads are not configured. Existing portfolio images remain available.

The assistant uses the existing portfolio knowledge provider, not a paid LLM. Voice depends on browser speech support and microphone permission.

www.harshaz.com is not connected or verified. If you own it, add it in the frontend Vercel project's Domains settings, copy the exact DNS records shown there, then update NEXT_PUBLIC_SITE_URL and backend FRONTEND_URL and redeploy. The free vercel.app URL works without buying a domain.
