# ARCHITECTURE DESIGN — RIFFAT'S CLASSROOM

## 1. System Overview
Riffat's Classroom is designed as a **modular monolith** built on Next.js App Router (React 19, TypeScript strict mode). It balances high development velocity and unified type safety with clear domain module boundaries.

### Dual-Target Deployment Architecture
```
                         +-----------------------------+
                         |       Client Browsers       |
                         |   (Desktop, Tablet, Mobile) |
                         +--------------+--------------+
                                        |
                 +----------------------+----------------------+
                 |                                             |
                 v                                             v
    +-------------------------+                   +-------------------------+
    |    Vercel Deployment    |                   |    Docker Deployment    |
    |  - Next.js Edge / Node  |                   |  - Nginx Reverse Proxy  |
    |  - Serverless Functions |                   |  - Next.js Standalone   |
    |  - Vercel Blob Storage  |                   |  - Local / S3 Storage   |
    |  - Vercel Cron Engine   |                   |  - Containerized Cron   |
    +------------+------------+                   +------------+------------+
                 |                                             |
                 +----------------------+----------------------+
                                        |
                 +----------------------+----------------------+
                 |                                             |
                 v                                             v
    +-------------------------+                   +-------------------------+
    |   PostgreSQL Database   |                   |   Redis Cache & Queue   |
    | (Neon Serverless /      |                   | (Upstash / Container    |
    |  PostgreSQL 16 in Docker|                   |  Redis 7)               |
    +-------------------------+                   +-------------------------+
```

---

## 2. Directory Structure & Domain Separation
```
riffats-classroom/
├── .github/              # CI/CD workflows for lint, typecheck, tests, build
├── docs/                 # Architectural specifications & operating manuals
├── prisma/
│   ├── schema.prisma     # Full normalized schema with indexes & constraints
│   ├── migrations/       # Version-controlled SQL migrations
│   └── seed.ts           # Comprehensive, realistic seed data (labeled as seed)
├── public/
│   ├── images/           # Logo, brand assets, default course covers
│   ├── fonts/            # Custom English & Bengali web fonts
│   └── manifest.json     # PWA manifest
├── src/
│   ├── app/              # Next.js App Router (Pages, Layouts, Route Handlers)
│   │   ├── (public)/     # Public landing, about, contact, courses, lessons, challenges
│   │   ├── (auth)/       # Sign in, verify OTP, magic link, callback
│   │   ├── (student)/    # Student dashboard, my learning, exams, certificates
│   │   ├── (teacher)/    # Teacher console, lesson editor, grading, questions
│   │   ├── (admin)/      # Administrative panel, users, settings, audit logs
│   │   ├── api/          # Route Handlers (auth, webhooks, blob uploads, cron)
│   │   └── verify/       # Public certificate verification
│   ├── components/       # Reusable UI components
│   │   ├── ui/           # Radix / shadcn atomic primitives (Button, Dialog, Input...)
│   │   ├── layout/       # Navbar, Footer, Sidebar, MobileNav
│   │   └── common/       # VideoPlayer, RichTextViewer, EmptyState, ErrorBoundary
│   ├── features/         # Domain-Driven Feature Modules
│   │   ├── auth/         # Better Auth config, guards, session utilities
│   │   ├── users/        # User service, guardian linking, student profiles
│   │   ├── lessons/      # Lesson CMS, media attachments, progress service
│   │   ├── courses/      # Course curriculum, enrollment, completion engine
│   │   ├── questions/    # Question Bank, versioning, tag management
│   │   ├── quizzes/      # Assessment builder, attempt state machine, timer, scoring
│   │   ├── daily-challenge/ # Deterministic daily generator, streaks, scheduler
│   │   ├── certificates/ # PDF certificate generation, verification token service
│   │   ├── community/    # Forums, private class channels, safe student messaging
│   │   ├── notifications/# In-app notifications & transactional email
│   │   └── analytics/    # Student progress aggregation & teacher insight reports
│   ├── lib/              # Shared utilities
│   │   ├── db.ts         # Prisma client singleton with connection pooling
│   │   ├── auth.ts       # Authentication client & server helpers
│   │   ├── storage.ts    # Unified storage interface (Vercel Blob / Local / S3)
│   │   ├── video.ts      # Video embed parser (YouTube, Loom, direct video)
│   │   ├── timezone.ts   # Asia/Dhaka date formatting & UTC conversion
│   │   └── utils.ts      # Tailwind class merging & format helpers
│   ├── styles/           # Global styles and Tailwind custom tokens
│   └── types/            # Shared TypeScript domain interfaces
├── tests/
│   ├── unit/             # Grading engine, schedule, streak, and utility tests
│   ├── integration/      # Database queries, auth guards, enrollment flows
│   └── e2e/              # Playwright browser end-to-end tests
├── Dockerfile            # Multi-stage production build (Node 22, standalone)
├── docker-compose.yml    # App + PostgreSQL 16 + Redis 7 + Nginx
├── vercel.json           # Vercel deployment & cron job definitions
└── package.json
```

---

## 3. Technology Choices & Justifications

### 3.1 Next.js 16 (App Router) + React 19
- **Server Components:** Default to server rendering for zero client-bundle overhead on public lesson pages, course catalogs, and news articles.
- **Server Actions:** Secure, type-safe mutations for quiz submissions, lesson progress, and forum replies without writing boilerplate fetch code.
- **Route Handlers:** Dedicated RESTful HTTP endpoints for direct upload token issuance, Vercel cron triggers, webhooks, and PDF downloads.

### 3.2 Database: Neon PostgreSQL / PostgreSQL 16 & Prisma ORM
- Strict relational constraints (`ON DELETE CASCADE / RESTRICT`), composite unique indexes (e.g. `[challengeDate, gradeLevel]`), and foreign keys.
- Connection pooling via Neon PgBouncer on Vercel; standard connection pool in Docker.

### 3.3 Storage Abstraction: Vercel Blob & Local S3 Fallback
- **Browser-to-Cloud Uploads:** Files (PDFs, worksheets, video posters) are uploaded directly to Vercel Blob using pre-signed upload tokens (`@vercel/blob/client`). Heavy binaries never pass through serverless function request bodies.
- **Local/S3 fallback:** Configured via `STORAGE_DRIVER=blob|s3|local` for seamless self-hosted Docker deployments.

### 3.4 Video Provider Architecture
```typescript
interface VideoAsset {
  provider: 'YOUTUBE' | 'LOOM' | 'DIRECT' | 'MUX';
  url: string;
  playbackId?: string;
  durationSeconds?: number;
  thumbnailUrl?: string;
}
```
- YouTube embeds are utilized for free public educational videos (e.g., Riffat's existing YouTube channel `@riffats.classroom`).
- Loom and direct uploaded videos support private coursework and quick teacher explanations.
- Pluggable Mux provider hook is ready for protected HLS streaming.

### 3.5 Assessment & Quiz Engine Architecture
- **State Machine:**
  `NOT_STARTED` ➔ `IN_PROGRESS` ➔ `SUBMITTED` / `EXPIRED` ➔ `PENDING_GRADING` ➔ `GRADED`
- **Server-Authoritative Time:**
  When an attempt starts, `startedAt` and `expiresAt = startedAt + quiz.durationMinutes` are written to PostgreSQL. On every answer autosave or submission, the server verifies `NOW() <= expiresAt + GracePeriod(30s)`.
- **Zero Answer Key Leakage:**
  Quiz questions sent to the client during an in-progress attempt **never** contain `correctAnswer` or `explanation`. Answers are evaluated strictly server-side.

### 3.6 Daily Grammar Challenge Architecture
- **Deterministic Scheduling:** A scheduled job (or on-demand idempotent trigger) calculates:
  `Seed = Hash(ScheduleID + DateString + GradeLevel)`
- Selects the target question count from the approved Question Bank tagged with today's scheduled topic.
- A database unique constraint `@@unique([scheduleId, date, gradeLevel])` guarantees no duplicate challenges are ever created.

