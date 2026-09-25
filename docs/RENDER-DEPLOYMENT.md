# Render deployment

The active architecture is Vercel frontend + Render backend + Neon PostgreSQL + Cloudinary image URLs.

Use [the full deployment guide](FULL-STACK-DEPLOYMENT.md) for the exact root directory, environment variables, migration and seed commands, Docker option, and account prerequisites. The root render.yaml provisions only a Node web service using a separately supplied Neon database. It no longer creates a Render PostgreSQL trial database.

Previous local database records must be copied deliberately; provisioning an empty database does not copy them automatically. The older Vercel backend project is not used by this architecture.
