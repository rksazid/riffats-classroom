# VERCEL DEPLOYMENT GUIDE — RIFFAT'S CLASSROOM

This guide provides step-by-step instructions for deploying Riffat's Classroom to **Vercel** with a serverless PostgreSQL database (such as Neon).

---

## 1. Prerequisites
1. A Vercel Account ([vercel.com](https://vercel.com))
2. A PostgreSQL Database (e.g. [Neon.tech](https://neon.tech), Supabase, or AWS RDS)
3. A Vercel Blob store (optional, created with one click in Vercel Storage)

---

## 2. Environment Variables Configuration in Vercel
In your Vercel Project Dashboard ➔ **Settings** ➔ **Environment Variables**, configure the following:

| Variable | Recommended Production Value | Description |
|---|---|---|
| `DATABASE_URL` | `postgresql://user:pass@ep-xyz-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require&pgbouncer=true` | Pooled connection string for Serverless Functions |
| `DIRECT_URL` | `postgresql://user:pass@ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require` | Direct connection string for Prisma migrations |
| `NEXT_PUBLIC_APP_URL` | `https://your-custom-domain.com` or `https://riffats-classroom.vercel.app` | Canonical site URL |
| `AUTH_SECRET` | `openssl rand -base64 32` | 32+ character random secret for sessions |
| `STORAGE_DRIVER` | `blob` | Uses `@vercel/blob` for direct client document uploads |
| `BLOB_READ_WRITE_TOKEN` | Automatically provisioned when linking Vercel Blob | Token for file uploads |
| `CRON_SECRET` | Strong random secret string | Protects `/api/cron/daily-challenge` trigger |
| `NEXT_PUBLIC_DEFAULT_TIMEZONE` | `Asia/Dhaka` | Timezone for daily challenge & exam deadlines |
| `GOOGLE_CLIENT_ID` | (Optional) Google OAuth Client ID | For "Continue with Google" |
| `GOOGLE_CLIENT_SECRET` | (Optional) Google OAuth Client Secret | For "Continue with Google" |

---

## 3. Database Initialization (Prisma & Neon)
Before or during your first deployment, push the schema and seed initial data:

```bash
# Push schema to Neon
DATABASE_URL="your-neon-direct-url" pnpm db:push

# Seed confirmed educational categories and initial teacher/student records
DATABASE_URL="your-neon-direct-url" pnpm db:seed
```

---

## 4. Deploying via Vercel CLI or Git Integration

### Option A: Using Git (Recommended)
1. Push this repository to GitHub or GitLab.
2. In Vercel, click **"Add New Project"** ➔ Select the `riffats-classroom` repository.
3. Select **Next.js** framework preset.
4. Add the environment variables listed above.
5. Click **"Deploy"**.

### Option B: Using Vercel CLI
```bash
# Login to Vercel
pnpm dlx vercel login

# Link and deploy
pnpm dlx vercel --prod
```

---

## 5. Automated Background Jobs (Vercel Cron)
The file `vercel.json` automatically registers the cron job:
```json
{
  "framework": "nextjs",
  "crons": [
    {
      "path": "/api/cron/daily-challenge",
      "schedule": "0 0 * * *"
    }
  ]
}
```
Vercel will trigger `/api/cron/daily-challenge` every day at midnight UTC (6:00 AM Asia/Dhaka), generating that day's scheduled Grammar Challenge idempotently.
