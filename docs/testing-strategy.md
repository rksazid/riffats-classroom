# TESTING STRATEGY & QUALITY GATES

## 1. Testing Pyramid & Tools

```
            / \
           /   \       Playwright E2E Tests (Critical User Journeys)
          /-----\
         /       \     Integration Tests (Prisma ORM, Auth Guards, Action APIs)
        /---------\
       /           \   Unit Tests (Grading Engine, Scheduling, Streaks, Parsers)
      /-------------\
```

| Layer | Framework / Tool | Scope |
|---|---|---|
| **Unit Testing** | Vitest | Assessment grading algorithms, partial credit rules, date/timezone conversions (Asia/Dhaka), daily quiz deterministic selection, streak calculations, video URL parsers. |
| **Integration Testing** | Vitest + Prisma Test Client | User registration, RBAC permission guards, lesson progress tracking, quiz attempt state transitions, certificate eligibility rules. |
| **End-to-End Testing** | Playwright | 16 Critical User Workflows: Public guest quiz, student course enrollment, timed exam auto-save and expiry, teacher quiz publishing, certificate verification, and mobile responsiveness. |
| **Accessibility (a11y)** | @axe-core/playwright | WCAG 2.2 AA audit on all public and learning interfaces. |
| **Race Condition Tests** | Vitest Concurrency | Simultaneous quiz submissions, duplicate certificate generation requests, concurrent daily challenge generation. |

---

## 2. Critical Workflows for E2E Verification
1. **Public Guest Journey:** Visitor arrives, explores lessons, takes a public grammar quiz without login, receives immediate feedback.
2. **Student Authentication & Enrollment:** Student signs in, enrolls in "Mastering English Sentences", completes lessons, and updates progress bar.
3. **Timed Examination Integrity:** Student enters timed exam, server issues authoritative expiry time, student refreshes browser (saved answers restored), exam expires, late submissions rejected.
4. **Teacher Assessment Creation:** Teacher creates questions in question bank, builds quiz, sets duration and access rules, publishes.
5. **Daily Challenge Execution:** Daily challenge cron runs or triggers on-demand; exactly one instance created for the calendar date; student takes challenge and streak increments.
6. **Certificate Issuance & Verification:** Student passes course final assessment, server issues verifiable certificate, student views PDF, visitor verifies at `/verify/[code]`.
7. **Permission Boundary:** Unauthorized student cannot view another student's exam answers or attempt analytics.
8. **Mobile Learning Experience:** All lesson viewing, quiz taking, and navigation controls render responsively on mobile screen viewports.

