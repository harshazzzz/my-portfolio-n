# Project Management CMS

Open /admin/projects after signing in. Search by title/category/technology; filter by category, featured flag or status; switch between table and grid. Add projects at /admin/projects/create and edit at /admin/projects/:id/edit. Deletion asks for confirmation and is permanent.

## Existing projects preserved

The four original projects were imported as PUBLISHED: Wadiya POS System, AutoCare Mobile Application, Library Management System, and Alfa Community Smart IoT Solution. Titles, introductions, summaries, technologies, roles, features, benefits, repository/demo URLs, featured status, order, and custom preview styles were copied to PostgreSQL. The original source data remains in src/data/projects.ts as an import source. Runtime project lists now read the API.

The import uses createMany with skipDuplicates: it does not overwrite an existing slug or admin edits. Run it once for a new environment. Re-running it after deliberately deleting or renaming an original project will restore the now-missing original slug; it is not run automatically on application startup.

The schema includes additional role/features/benefits/accent/preview/sortOrder fields to preserve the existing presentation. Role, features and benefits can be edited under Additional project details. New projects use a neutral visual when no cover is supplied.

## API

JWT ADMIN required:
- POST /projects
- PATCH /projects/:id
- DELETE /projects/:id
- GET /projects/admin/all

Public, published only:
- GET /projects
- GET /projects/:slug

Next.js uses /api/admin/projects and /api/admin/projects/:id as same-origin authenticated forwarding routes. They share the Blog CMS forwarding helper, HttpOnly cookie, origin checks, and current backend role validation. No browser localStorage tokens or new authentication mechanism were added.

Public details are available at /projects/:slug. The homepage keeps the existing project cards and dialog layout, with a link to full details and gallery. Unpublishing and deletion immediately remove projects from public data. Dashboard counts now reflect the CMS database.

## Content and images

Description is plain text and React escapes HTML. Slugs must be unique lowercase letters/numbers separated by single hyphens. GitHub links accept https://github.com/...; live links accept HTTP or HTTPS to preserve the existing Library demo. Image inputs accept HTTPS URLs; covers may also reference /projects/ assets. Gallery: up to 20 URLs, one per line. Technologies: comma-separated, up to 40. Image fields are ready to receive Cloudinary secure_url values later. Uploading files, storage credentials, and storage APIs are intentionally not implemented.

## Database commands

From AI-Portfolio:

    npm --prefix backend run prisma:generate
    npm --prefix backend run prisma:deploy
    npm --prefix backend run projects:import

Migration 20260926000000_project_cms and the four-project import were applied locally. No User or Blog records were removed.

## Validation

    npm --prefix backend run test:projects
    npm --prefix backend run test:blogs
    npm --prefix backend run test:auth
    npm --prefix frontend run build
    npm --prefix frontend run lint

With both apps running:

    node backend/test/projects.frontend.mjs

Integration tests use temporary records in the configured development database and clean them up; do not run against production. Set TEST_ADMIN_EMAIL, TEST_ADMIN_PASSWORD, and optionally TEST_FRONTEND_URL for a non-default development test account. The frontend preservation check expects the four original projects to still be published.

Manual: confirm four original cards, open details and links; search/filter/switch view; create a draft with gallery URLs; confirm its public URL returns 404; edit and publish; verify homepage/detail/gallery; toggle Featured; unpublish; delete a temporary project; verify a duplicate slug is rejected. Log out and confirm admin routes require login.

## Created files

Backend:
- src/projects/projects.module.ts
- src/projects/projects.controller.ts
- src/projects/projects.service.ts
- src/projects/dto/create-project.dto.ts
- src/projects/dto/update-project.dto.ts
- prisma/migrations/20260926000000_project_cms/migration.sql
- prisma/import-projects.ts
- test/projects.integration.mjs
- test/projects.frontend.mjs

Frontend:
- src/services/project.service.ts
- src/lib/projects.ts
- src/lib/admin-api.ts (shared with Blog CMS)
- src/components/admin/projects/ProjectForm.tsx
- src/components/admin/projects/ProjectTable.tsx
- src/components/admin/projects/ProjectCard.tsx
- src/components/admin/projects/projects.module.css
- src/app/api/admin/projects/route.ts
- src/app/api/admin/projects/[id]/route.ts
- src/app/admin/(protected)/projects/create/page.tsx
- src/app/admin/(protected)/projects/[id]/edit/page.tsx
- src/app/projects/[slug]/page.tsx
- PROJECT-CMS.md

## Modified files

Backend: prisma/schema.prisma, src/app.module.ts, package.json, test/auth.integration.mjs.
Frontend: existing admin projects/dashboard pages; src/lib/admin-blog-api.ts (re-export shared helper); src/data/projects.ts (extended type only); homepage; PortfolioExperience.tsx; Projects.tsx; public ui/ProjectCard.tsx.

The protected route group preserves the requested /admin/projects URLs. Admin ProjectCard provides management actions; the existing public ui/ProjectCard remains the portfolio display component. Table and grid share a single ProjectActions implementation. Forms and tables reuse the Blog CMS styles. No new packages are required.
