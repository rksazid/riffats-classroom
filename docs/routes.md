# ROUTE INVENTORY & INFORMATION ARCHITECTURE

## 1. Public Routes
| Route | Page Name | Purpose |
|---|---|---|
| `/` | Home / Landing Page | Welcoming hero, brand identity, featured categories, latest lessons, daily challenge preview, teacher intro. |
| `/about` | About Riffat's Classroom | Teacher background, pedagogical philosophy, school background, vision. |
| `/lessons` | Lessons Catalog | Public directory of published lessons with subject, topic, and difficulty filters. |
| `/lessons/[slug]` | Lesson Viewer | Video embed (YouTube/Loom/Direct), rich text, worksheets, practice quiz. |
| `/courses` | Courses Catalog | Course directory with curriculum preview, enrollment status, instructor bio. |
| `/courses/[slug]` | Course Overview | Detailed syllabus, learning outcomes, requirements, enrollment CTA. |
| `/daily-challenge` | Daily Grammar Challenge | Today's active daily challenge preview, guest or student challenge participation. |
| `/quizzes` | Public Quizzes | Practice quizzes and guest-eligible assessments. |
| `/quizzes/[slug]` | Assessment Player | Full-screen timed/untimed assessment engine with auto-save and submission. |
| `/community` | Public Forum | Discussion categories, search, pinned announcements, and threads. |
| `/community/threads/[slug]` | Forum Thread | Reading discussion threads and replies. |
| `/notices` | Notices & Announcements | School announcements, exam alerts, holiday notices. |
| `/contact` | Contact & Inquiries | Contact form, email, social links, location. |
| `/verify/[code]` | Certificate Verification | Public verification of issued certificate (displays recipient name, course, issue date). |
| `/privacy` | Privacy Policy | Child-safe privacy terms, data handling, guardian consent details. |
| `/terms` | Terms of Service | Community rules and acceptable use policy. |

---

## 2. Authentication Routes
| Route | Purpose |
|---|---|
| `/sign-in` | Email OTP, Magic Link, Google OAuth, and password login options. |
| `/sign-up` | New learner/guardian registration with grade level selection. |
| `/verify-otp` | One-time password verification screen. |
| `/guardian-link` | Linking a student account to a parent/guardian. |

---

## 3. Student Authenticated Routes (`/student/*`)
| Route | Purpose |
|---|---|
| `/student/dashboard` | Student home: streak counter, continue learning, today's challenge, enrolled courses. |
| `/student/courses` | Enrolled courses, completion percentages, active modules. |
| `/student/courses/[slug]/learn` | Interactive distraction-free course player (sidebar + lessons + progress). |
| `/student/quizzes` | Available upcoming exams, completed quizzes, score reports. |
| `/student/quizzes/[id]/review` | Detailed quiz review (if teacher configured results to be visible). |
| `/student/certificates` | Earned certificates with download PDF buttons and public verification links. |
| `/student/messages` | Safe student-to-teacher messaging interface. |
| `/student/notifications` | In-app notification center. |
| `/student/profile` | Edit avatar, grade level, notification preferences, guardian link. |

---

## 4. Teacher Console Routes (`/teacher/*`)
| Route | Purpose |
|---|---|
| `/teacher/dashboard` | Active courses, published lessons, upcoming exams, grading queue summary. |
| `/teacher/lessons` | Manage lessons (Draft, Published, Scheduled, Archive). |
| `/teacher/lessons/new` | Rich text and multimedia lesson creator. |
| `/teacher/lessons/[id]/edit` | Lesson editor with video embed, worksheets, and preview. |
| `/teacher/courses` | Course builder and curriculum organizer (modules and lessons). |
| `/teacher/courses/[id]/curriculum` | Drag-and-drop / ordering modules and lessons. |
| `/teacher/question-bank` | Central question bank: search, filter by topic/difficulty, CSV import/export. |
| `/teacher/question-bank/new` | Multi-type question authoring (MCQ, True/False, Blanks, Matching, Passage). |
| `/teacher/quizzes` | Create, schedule, and publish exams and quizzes. |
| `/teacher/quizzes/[id]/grading` | Teacher grading queue for short/long answers and regrading. |
| `/teacher/quizzes/[id]/analytics` | Score distribution, question-by-question error rates, CSV export. |
| `/teacher/students` | View enrolled students in teacher's courses, progress, and activity. |
| `/teacher/messages` | Inbox for student queries and educational communication. |

---

## 5. Administrative Panel Routes (`/admin/*`)
| Route | Purpose |
|---|---|
| `/admin/dashboard` | Platform metrics (Active learners, course completions, server health). |
| `/admin/users` | User management: role assignments, account status, invitations. |
| `/admin/subjects-topics` | Manage academic structure (Subjects, Topics, Subtopics). |
| `/admin/daily-challenge` | Manage weekly topic schedule and inspect generation logs. |
| `/admin/certificates` | Manage certificate templates, issue/revoke certificates. |
| `/admin/community` | Moderate flagged forum posts and discussions. |
| `/admin/notices` | Author, pin, and schedule platform notices. |
| `/admin/site-settings` | Configure logo, hero copy, contact info, social links, and SEO. |
| `/admin/audit-logs` | Security and operational audit trail. |

---

## 6. API Route Handlers
| Endpoint | Method | Purpose |
|---|---|---|
| `/api/auth/*` | ALL | Better Auth endpoints (session, login, OAuth callback). |
| `/api/upload` | POST | Authenticated Vercel Blob client upload token generation. |
| `/api/cron/daily-challenge`| GET/POST | Vercel Cron trigger for idempotent daily grammar challenge generation. |
| `/api/certificates/[id]/pdf`| GET | Generate and stream high-quality PDF certificate. |
| `/api/quizzes/[id]/autosave`| POST | Server-authoritative autosave for assessment attempt answers. |
| `/api/quizzes/[id]/submit` | POST | Finalize exam attempt and calculate server-side grade. |
