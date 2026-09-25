# Vercel frontend deployment

The active architecture is Vercel frontend + Render backend + Neon PostgreSQL + Cloudinary image URLs.

See [FULL-STACK-DEPLOYMENT.md](FULL-STACK-DEPLOYMENT.md) for the complete current setup, GitHub commands, environment inventory, DNS steps, and verification checklist.

Vercel settings: root frontend, Next.js framework (installed 16.3.6), Node 24.x, npm ci, npm run build, default output directory. Keep src/proxy.ts and the same-origin /api authentication architecture. Set NEXT_PUBLIC_API_URL to the actual Render HTTPS origin; optional server-only BACKEND_URL overrides it. No JWT, database or Cloudinary secrets belong in the frontend environment.

The harsha-portfolio project is linked, but that alone does not mean a deployment is live. Domain DNS must be verified separately. Use the exact CNAME target shown in Vercel's Domains dashboard.
