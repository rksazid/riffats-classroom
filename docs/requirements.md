# RIFFAT'S CLASSROOM — MASTER SPECIFICATIONS & REQUIREMENTS

## 1. System Vision & Objective
Riffat's Classroom is a production-grade, database-backed educational web application and Learning Management System (LMS).
- **Target Audience:** Young learners (ages 6–18), teachers, administrators, and guardians.
- **Geographic Focus:** Bangladesh (with support for nationwide & international access, Asia/Dhaka default timezone, Bengali and English bilingual localization).
- **Primary Subject:** English language learning (Grammar, Vocabulary, Sentence Building, Reading, Writing, Speaking, and School Exam Preparation).
- **Extensibility:** Multi-subject extensible architecture.
- **Founder & Pedagogical Background:** Led by an experienced English teacher formerly at Hajee Moajjem Ali High School, Demra Staff Quarter, Demra, Dhaka.
- **Brand Personality:** Warm, friendly, encouraging, modern, trustworthy, high-contrast, playful yet credible.

---

## 2. Dual Deployment Strategy
1. **Primary Immediate Deployment:** Vercel (Next.js App Router, Serverless Functions, Edge Middleware, Vercel Blob, Vercel Cron, Neon PostgreSQL).
2. **Dedicated Self-Hosted Deployment:** Multi-stage Docker container (`Dockerfile` with Next.js standalone runner), `docker-compose.yml` (App + PostgreSQL 16 + Redis 7 + Nginx reverse proxy with SSL support and automated volume backups).

---

## 3. Core Modules & Functionality
1. **Public Website:**
   - Hero with brand logo, friendly copy, verified value propositions.
   - Featured English categories (Grammar, Vocabulary, Sentence Building, Reading, Writing, Speaking, Exam Prep).
   - Latest lessons published from DB with duration, difficulty, and teacher metadata.
   - Daily Grammar Challenge showcase.
   - Featured recorded courses.
   - Teacher introduction, How it works, Public Notices & Discussions, Configurable Footer.
2. **Authentication & User Management:**
   - Multi-provider auth: Google OAuth, Email OTP, Magic Link, Credentials.
   - Younger learner onboarding: Teacher/guardian-linked accounts, secure enrollment codes.
   - Role-Based Access Control (RBAC): Super Admin, Admin, Teacher, Content Editor, Moderator, Student, Guardian, Guest.
3. **Lessons & Educational Content (CMS):**
   - Mixed-content lessons: Rich-text, YouTube/Loom video embeds, direct file uploads, worksheets, PDFs, practice exercises.
   - Topic hierarchy: Subject → Topic → Subtopic → Lesson.
   - Progress tracking: Started, in-progress, completed, last position.
4. **Courses & Learning Paths:**
   - Structured curriculum: Course → Module → Lesson.
   - Enrollment modes: Public/free, login-required, invite-only, teacher-assigned.
   - Distraction-free course player (sidebar navigation, module progress, next lesson continuation).
5. **Quiz & Examination Engine:**
   - 10 Question types: Single MCQ, Multiple MCQ, True/False, Fill in the blank, Short answer, Long-form answer, Matching pairs, Ordering/sequencing, Dropdown selection, Passage-based questions.
   - Reusable Question Bank with topic tagging, difficulty levels, point weighting, and versioned snapshots.
   - Timed examination engine with server-authoritative timer, auto-save, reconnect recovery, anti-tampering checks, and attempt state machine.
   - Grading engine with automated scoring, partial credit, and teacher grading queue.
6. **Daily English Grammar Challenge:**
   - Scheduled daily challenges based on weekly recurring or custom calendar topics (e.g., Monday: Parts of Speech, Tuesday: Articles, etc.).
   - Idempotent, deterministic question generation snapshotting questions per date/grade.
   - Streaks, XP, and personal progress analytics without toxic competitive stress.
7. **Certificates & Verification:**
   - Server-verified completion requirements (all lessons done + passing final quiz score).
   - High-fidelity PDF certificate generation.
   - Public verification endpoint with unguessable cryptographic token and QR code.
8. **Community, Forums & Safe Messaging:**
   - Public moderated forums (General English, Grammar, Vocabulary, Study Tips).
   - Private course/cohort discussion spaces.
   - Child-safe student-to-teacher messaging with moderation auditing and abuse prevention.
9. **Notices, News & Notifications:**
   - Categorized announcements, school notices, educational news articles.
   - In-app notification center + email delivery integration.
10. **Teacher & Administrator Dashboards:**
    - Full LMS operations, analytics charts (Recharts), question bank manager, quiz builder, enrollment manager, grading queue, site settings editor, audit logs.
