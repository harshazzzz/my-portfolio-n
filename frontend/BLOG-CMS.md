# Blog CMS

Open /admin/blogs after signing in. Create an article, save a draft, edit it, and choose Published to make it public. The table supports text search and status filtering. Delete requires confirmation and permanently removes the article.

## Content rules

Title, slug, category, excerpt, content, tags array and status are validated by the backend. Slugs use lowercase letters, numbers and single hyphens, and must be unique. Content is plain text with blank-line paragraph separation; HTML is escaped, never executed. The optional coverImage field accepts HTTPS URLs (including Cloudinary delivery URLs) or existing /blog/ assets. No upload credentials or upload endpoint are included yet. A future Cloudinary uploader should pass its secure_url into coverImage.

Drafts have no public URL and are excluded from public lists. Publishing sets publishedAt; editing a published article preserves that timestamp. Returning to draft clears it. Republishing creates a new publication timestamp. Public pages read the API without caching, so edits and unpublishing take effect immediately.

The existing public section design is preserved. Published database records replace the static starter preview feed; original src/data/blogs.ts examples remain in the repository. An empty database shows the existing empty state. Dashboard blog counts and recent articles now use the CMS database. Other portfolio sections are unchanged.

## API and security

Admin JWT required: POST /blogs, PATCH /blogs/:id, DELETE /blogs/:id, GET /blogs/admin/all.
Public published-only endpoints: GET /blogs, GET /blogs/:slug.

Next.js forwards authenticated requests through /api/admin/blogs and /api/admin/blogs/:id using the existing HttpOnly cookie. Mutations require matching Origin/Host. The backend rechecks the authenticated user's current ADMIN role on every private request. Authentication and password flows are unchanged.

## Database

From the project root:

    npm --prefix backend run prisma:generate
    npm --prefix backend run prisma:deploy

The migration 20260925000000_blog_cms was applied locally. No existing User records or tables were removed. The existing seed remains for admin creation; no articles are automatically published by seeding.

## Verification

    npm --prefix backend run test:blogs
    npm --prefix backend run test:auth
    npm --prefix frontend run build
    npm --prefix frontend run lint

For the live frontend flow, with both applications running:

    node backend/test/blogs.frontend.mjs

The live frontend test defaults to the development admin account; override TEST_ADMIN_EMAIL and TEST_ADMIN_PASSWORD via environment for another test account. Backend blog tests use real PostgreSQL and temporary uniquely named records, which they clean up. Run them against a development database, not production.

Manual: create a draft; confirm the public URL is 404; publish it; confirm it appears at /#blog; edit and reload; filter/search the admin list; cancel a deletion; confirm another deletion; log out and check protected routes redirect. Also try a duplicate slug, invalid cover URL and missing required fields.

## Added files

Backend:
- src/blogs/blogs.module.ts
- src/blogs/blogs.controller.ts
- src/blogs/blogs.service.ts
- src/blogs/dto/create-blog.dto.ts
- src/blogs/dto/update-blog.dto.ts
- prisma/migrations/20260925000000_blog_cms/migration.sql
- test/blogs.integration.mjs
- test/blogs.frontend.mjs

Frontend:
- src/services/blog.service.ts
- src/lib/admin-blog-api.ts
- src/components/admin/BlogManager.tsx
- src/components/admin/BlogEditor.tsx
- src/components/admin/blogs.module.css
- src/app/api/admin/blogs/route.ts
- src/app/api/admin/blogs/[id]/route.ts
- src/app/admin/(protected)/blogs/create/page.tsx
- src/app/admin/(protected)/blogs/[id]/edit/page.tsx
- BLOG-CMS.md

## Updated files

Backend: prisma/schema.prisma, src/app.module.ts, package.json.
Frontend: existing admin blogs and dashboard pages; RecentActivity.tsx; src/lib/api.ts; src/lib/blogs.ts; public blog article page; BlogCard.tsx (external image support).

The (protected) route group retains /admin/blogs and /admin/blogs/create URLs without introducing duplicate routes. No new packages were needed.
