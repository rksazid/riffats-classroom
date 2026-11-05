# ROLE-BASED ACCESS CONTROL (RBAC) & PERMISSIONS

## 1. System Roles
Riffat's Classroom enforces server-side authorization checks on every Server Action and Route Handler. Never rely purely on client-side state.

| Role | Description |
|---|---|
| **SUPER_ADMIN** | Platform owner (Riffat / Lead Administrator). Full system control, role assignment, audit logs, billing/site settings. |
| **ADMIN** | Educational and staff administration. Can manage teachers, cohorts, courses, question banks, notices, and site settings. |
| **TEACHER** | Instructors. Can author lessons, build courses, manage question banks, schedule quizzes, grade submissions, view student progress in their cohorts/courses. |
| **CONTENT_EDITOR** | Educational assistants. Can draft and edit lessons and question bank items; requires approval or publication privileges. |
| **MODERATOR** | Community managers. Can review flagged forum posts, lock discussions, moderate direct messages, and suspend disruptive comments. |
| **STUDENT** | Learners. Can enroll in courses, study lessons, take quizzes, participate in daily challenges, join approved forums, and receive certificates. |
| **GUARDIAN** | Parents/guardians. Can view linked student progress, attendance, grades, and manage minor consents. |
| **GUEST** | Unauthenticated visitors. Can view public landing, public lessons, public forum reads, and take public guest quizzes. |

---

## 2. Permission Matrix

| Capability / Action | SUPER_ADMIN | ADMIN | TEACHER | CONTENT_EDITOR | MODERATOR | STUDENT | GUARDIAN | GUEST |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Manage Platform Settings & Secrets** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **View Audit Logs** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Assign Roles to Users** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Create / Edit Any Lesson** | ✅ | ✅ | Own Only | Draft Only | ❌ | ❌ | ❌ | ❌ |
| **Publish / Archive Lessons** | ✅ | ✅ | Own Only | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Upload Multimedia to Blob** | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Create / Manage Courses** | ✅ | ✅ | Own Only | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Access Question Bank** | ✅ | ✅ | ✅ | Draft Only | ❌ | ❌ | ❌ | ❌ |
| **Schedule / Publish Quizzes** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Configure Daily Challenge Schedule** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Grade Subjective Answers** | ✅ | ✅ | Enrolled Only | ❌ | ❌ | ❌ | ❌ | ❌ |
| **View Student Quiz Results & Analytics**| ✅ | ✅ | Own Course Only | ❌ | ❌ | Own Only | Linked Ward Only | ❌ |
| **Enroll in Courses** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Take Assessments** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | Public Only |
| **Issue / Revoke Certificates** | ✅ | ✅ | Own Course Only | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Download Own Certificate** | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | Linked Ward Only | ❌ |
| **Verify Public Certificate** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Post in Community Forum** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Moderate Community Forum** | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| **Student-to-Teacher Direct Messaging** | ✅ | ✅ | With Students | ❌ | Read Audit | With Teachers | ❌ | ❌ |
| **Post School Notices** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## 3. Server-Side Guard Patterns
Every Server Action and API route must use structured session checks:

```typescript
// Example: src/features/auth/guards.ts
export async function requireRole(allowedRoles: Role[]) {
  const session = await getSession();
  if (!session || !session.user) {
    throw new AuthorizationError('Authentication required');
  }
  const hasRole = session.user.roles.some((r) => allowedRoles.includes(r));
  if (!hasRole) {
    throw new AuthorizationError('Insufficient permissions');
  }
  return session.user;
}

export async function requireCourseTeacherOrAdmin(courseId: string) {
  const user = await requireRole(['SUPER_ADMIN', 'ADMIN', 'TEACHER']);
  if (user.roles.includes('SUPER_ADMIN') || user.roles.includes('ADMIN')) return user;
  
  const isInstructor = await db.course.findFirst({
    where: { id: courseId, instructorId: user.id },
  });
  if (!isInstructor) {
    throw new AuthorizationError('You do not own this course');
  }
  return user;
}
```

