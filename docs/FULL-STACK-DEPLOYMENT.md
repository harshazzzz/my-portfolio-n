# Harsha Portfolio — production deployment

## Architecture and current status

Frontend: Vercel. Backend: Render Node web service. Database: Neon PostgreSQL. CMS images: Cloudinary HTTPS delivery URLs.

The installed frontend is Next.js 16.3.6, not 15. Keep its existing `src/proxy.ts`; do not add duplicate middleware. Portfolio sections, authentication and animations are preserved. The browser calls same-origin Next.js `/api` endpoints; those forward to the Render API and retain secure HttpOnly login cookies.

Local builds do not publish the website. Vercel frontend project `harshaz/harsha-portfolio` is linked. No Render service is currently running. No Git remote is configured, and the Neon Marketplace installation has not completed its account terms step. The previously created Vercel backend project is unused in this architecture. No paid plan is selected by this configuration.

## 1. Push source to GitHub

Create an empty repository in your own GitHub account. From AI-Portfolio, replace YOUR_REPOSITORY with its actual name:

```powershell
git status --short
git add .
git diff --cached --stat
git commit -m "Prepare full-stack production deployment"
git branch -M main
git remote add origin https://github.com/harshazzzz/YOUR_REPOSITORY.git
git push -u origin main
```

If origin already exists, inspect `git remote -v` before changing it. Review staged files before committing. `.env`, `.env.local`, `.env.production.local`, root `.env.deploy`, `.vercel`, dependencies and build output are excluded. Both `.env.example` templates must be committed. Do not push database exports or API keys. Revoke the previously shared Render API credential after account setup is finished.

## 2. Neon PostgreSQL

1. Create a Neon project on the Free plan, preferably in Singapore near the Render service. Alternatively finish the Neon Marketplace terms step in Vercel before provisioning there.
2. Copy the SSL-enabled pooled connection string to backend DATABASE_URL. Keep `sslmode=require` and any supplied channel-binding parameters.
3. Copy the direct/non-pooler connection string to DIRECT_URL for migrations. `prisma.config.ts` uses DIRECT_URL if set; otherwise DATABASE_URL. Prisma runtime uses DATABASE_URL.
4. Save these only in the hosting dashboard or ignored local environment files.
5. Apply the committed migrations to the production database. Do not use `migrate dev`, `db push`, or reset commands in production.

From backend, with the production variables loaded into the process environment:

```powershell
npm install
npx prisma generate
npx prisma migrate deploy
```

`npm run build` now generates Prisma Client first. `npm run start:prod` applies pending migrations before starting NestJS. A failed migration prevents startup. The database needs to exist and be reachable at that point.

### Preserve existing records

Your local database currently contains one user and five projects. Do not replace it with only the four source-defined projects. After creating an empty migrated Neon database, store its DATABASE_URL in ignored `backend/.env.production.local` and run from backend:

```powershell
node prisma/copy-to-production.mjs
```

This explicit migration reads the local backend/.env and copies users (hashed passwords), projects, blogs and messages in a transaction. It refuses a nonempty target and does not print credentials. Existing reset tokens are cleared and token versions incremented. Back up and verify data before switching traffic. Do not run this as a recurring startup task.

### Seed a genuinely new database

For a fresh install only, securely set ADMIN_SEED_EMAIL and a unique ADMIN_SEED_PASSWORD of at least 12 characters. Set NODE_ENV=production, DATABASE_URL to production, then run:

```powershell
npm run prisma:seed
```

The seed hashes passwords and does not overwrite an existing account. Never use the development default in production. Remove the seed password from the environment afterward. `npm run projects:import` is a local one-off alternative for importing only the four source-defined projects; it needs the full repository because it reads frontend/src/data/projects.ts. Use the full data-copy procedure to retain CMS edits and all five existing projects.

## 3. Render web service

Connect the GitHub repository to Render and create a Node Web Service (Free plan), or use the root render.yaml Blueprint. The blueprint now creates only the API and asks for Neon URLs; it does not create a Render database.

| Setting | Value |
| --- | --- |
| Name | harsha-api (if available) |
| Root directory | backend |
| Runtime | Node |
| Node version | 24.x |
| Build command | npm install && npm run build |
| Start command | npm run start:prod |
| Health check | / |
| Region | Singapore |
| NPM_CONFIG_INCLUDE | dev |

Build tools and Prisma CLI must remain installed for generation and startup migrations. Render supplies PORT; do not hardcode 3001 in its dashboard. The app binds to 0.0.0.0. Local development defaults to port 3001.

Set DATABASE_URL, DIRECT_URL, JWT_SECRET (cryptographically random, at least 32 characters), JWT_EXPIRES_IN=1h and FRONTEND_URL. For an initial Vercel URL, use that actual origin; after domain verification use https://www.harshaz.com. CORS always allows the custom domain, adds localhost:3000 only outside production, and accepts extra exact HTTPS origins via CORS_ORIGINS. No wildcard origin is used. CORS does not replace JWT authorization.

Render previously rejected provisioning with HTTP 402 requiring billing verification. This account-specific gate may still apply even when selecting a free plan. No payment details are handled by repository code. Free services can sleep and have cold starts; they are not an always-on availability guarantee.

### Optional Docker deployment

The native Node service above is preferred. For Docker, use backend as the build context:

```powershell
docker build -t harsha-api ./backend
docker run --rm --env-file ./backend/.env.production.local -p 3001:3001 harsha-api
```

The env file must include JWT_SECRET and DATABASE_URL. The container runs as the non-root node user, excludes local secrets from the build context, retains Prisma CLI for startup migrations, and listens on PORT. Docker has not been available locally to run an image build.

## 4. Cloudinary images

Create a Cloudinary product environment and upload project/blog covers using its Media Library. Copy each HTTPS `secure_url` into the existing CMS Cover Image or Gallery Images fields. The frontend already allows res.cloudinary.com through next/image optimization. Local portrait, icons and CV remain intact.

The current CMS uses URL fields; no direct file-upload endpoint is implemented. Cloudinary credentials alone do not add that feature. If implementing signed uploads later, store CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET only on the backend. Never expose the API secret using NEXT_PUBLIC_ or enable a broadly permissive unsigned upload preset.

## 5. Vercel frontend

Import the same repository, or deploy the already linked frontend via CLI.

| Setting | Value |
| --- | --- |
| Framework | Next.js |
| Root directory | frontend |
| Node | 24.x |
| Install | npm ci |
| Build | npm run build |
| Output | Default (do not override with out) |

Set NEXT_PUBLIC_API_URL to the actual Render HTTPS origin. Optional BACKEND_URL overrides it on the server. Do not use the example hostname until it belongs to your deployed service. Do not set database/JWT/Cloudinary secrets on the frontend. Configure before building; Vercel configuration validation rejects a missing or non-HTTPS backend origin.

```powershell
cd frontend
npx vercel env add NEXT_PUBLIC_API_URL production
npx vercel --prod
```

Redeploy after changing environment variables. Verify the generated vercel.app URL before connecting the custom domain. Preview deployments carry noindex directives; use separate preview data if required.

## 6. Custom domain

In Vercel Project Settings > Domains add www.harshaz.com. At the registrar, set CNAME name `www` to the exact value Vercel displays. `cname.vercel-dns.com` is only appropriate when Vercel gives that value; it may supply a project-specific target instead. Remove only conflicting records for www and preserve mail records. Optionally add harshaz.com and redirect it to www using the records Vercel supplies.

Wait for DNS verification and HTTPS. Metadata, canonicals, robots and sitemap already target https://www.harshaz.com. Owning a custom domain is separate from free hosting; this workflow does not purchase a domain.

## Environment inventory

| Host | Variables |
| --- | --- |
| Vercel frontend | NEXT_PUBLIC_API_URL; optional BACKEND_URL |
| Render backend required | DATABASE_URL, JWT_SECRET |
| Render recommended | DIRECT_URL, JWT_EXPIRES_IN=1h, FRONTEND_URL, NODE_VERSION=24.15.0, NPM_CONFIG_INCLUDE=dev |
| Render automatic | PORT, NODE_ENV=production |
| Additional allowed origins | CORS_ORIGINS (comma-separated exact origins) |
| Admin seed only | ADMIN_SEED_EMAIL, ADMIN_SEED_PASSWORD |
| Password reset delivery | RESEND_API_KEY, RESET_EMAIL_FROM, FRONTEND_URL |
| Future signed Cloudinary uploads | CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET |

The chatbot currently uses curated portfolio answers, so OPENAI_API_KEY is not required. Browser voice features require HTTPS and supported browser permissions. Password reset email is not functional until the mail provider is configured.

## Final verification and URLs

Run `npm run build` in both frontend and backend. Run frontend `npm run lint` and backend `npm test -- src/config/environment.spec.ts`. Check production:

- Public home, projects, blog, contact, robots.txt and sitemap.xml.
- Admin login, logout, protected routes and database-backed CMS records.
- Contact submission, inbox visibility and read/unread behavior.
- Assistant responses, microphone and speech output on a supported HTTPS browser.
- Cloudinary images, mobile layout, light/dark modes, animations and CV download.
- Password recovery only after configuring mail delivery.

Expected URL formats (not live deployment confirmations):

- Frontend: https://www.harshaz.com (after DNS verification), initially the assigned https://PROJECT.vercel.app.
- Backend: https://harsha-api.onrender.com only if Render assigns that exact hostname; use the URL shown in its dashboard.

## References

- https://render.com/docs/monorepo-support
- https://render.com/docs/free
- https://neon.com/docs/guides/prisma
- https://cloudinary.com/documentation/upload_images
- https://vercel.com/docs/domains/working-with-domains/add-a-domain
