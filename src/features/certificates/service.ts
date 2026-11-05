import { db } from '@/lib/db';

export interface CertificateIssueResult {
  certificateId: string;
  certificateNumber: string;
  verificationCode: string;
  isAlreadyIssued: boolean;
}

/**
 * Server-side course completion verification and idempotent certificate issuance
 */
export async function issueCourseCertificate(
  userId: string,
  courseId: string
): Promise<CertificateIssueResult> {
  // 1. Check if already issued
  const existing = await db.certificate.findFirst({
    where: { userId, courseId, isRevoked: false },
  });

  if (existing) {
    return {
      certificateId: existing.id,
      certificateNumber: existing.certificateNumber,
      verificationCode: existing.verificationCode,
      isAlreadyIssued: true,
    };
  }

  // 2. Fetch course with mandatory lessons and user progress
  const [course, user, template] = await Promise.all([
    db.course.findUnique({
      where: { id: courseId },
      include: {
        modules: {
          include: {
            lessons: {
              where: { isMandatory: true },
            },
          },
        },
      },
    }),
    db.user.findUnique({ where: { id: userId } }),
    db.certificateTemplate.findUnique({ where: { courseId } }),
  ]);

  if (!course || !user) {
    throw new Error('Course or student not found.');
  }

  if (!course.certificateEnabled) {
    throw new Error('Certificates are not enabled for this course.');
  }

  // 3. Verify all mandatory lessons completed
  const mandatoryLessonIds = course.modules.flatMap((m) =>
    m.lessons.map((cl) => cl.lessonId)
  );

  const completedCount = await db.lessonProgress.count({
    where: {
      userId,
      lessonId: { in: mandatoryLessonIds },
      isCompleted: true,
    },
  });

  if (completedCount < mandatoryLessonIds.length) {
    throw new Error(
      `Course incomplete. ${completedCount} of ${mandatoryLessonIds.length} mandatory lessons finished.`
    );
  }

  // 4. Generate unique serial number
  const totalIssued = await db.certificate.count();
  const serial = (totalIssued + 1).toString().padStart(4, '0');
  const certificateNumber = `RC-${new Date().getFullYear()}-${serial}`;
  const verificationCode = crypto.randomUUID();

  // 5. Create certificate record
  const cert = await db.certificate.create({
    data: {
      certificateNumber,
      verificationCode,
      userId,
      courseId,
      templateId: template?.id,
      studentName: user.name,
      courseTitle: course.title,
      issuedAt: new Date(),
    },
  });

  // Mark enrollment as COMPLETED
  await db.courseEnrollment.updateMany({
    where: { courseId, userId },
    data: {
      status: 'COMPLETED',
      completedAt: new Date(),
    },
  });

  return {
    certificateId: cert.id,
    certificateNumber: cert.certificateNumber,
    verificationCode: cert.verificationCode,
    isAlreadyIssued: false,
  };
}

