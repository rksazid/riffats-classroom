import { db } from '@/lib/db';
import { QuizAccessMode, ResultVisibility } from '@prisma/client';

export interface GenerationResult {
  instanceId: string;
  quizId: string;
  quizSlug: string;
  isExisting: boolean;
}

/**
 * Deterministically and idempotently creates or retrieves today's Daily Grammar Challenge.
 */
export async function getOrCreateDailyChallenge(targetDate?: Date): Promise<GenerationResult> {
  const date = targetDate || new Date();
  
  // Format as YYYY-MM-DD in Asia/Dhaka
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Dhaka',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const dateString = formatter.format(date); // YYYY-MM-DD
  const normalizedDate = new Date(`${dateString}T00:00:00.000Z`);

  // Check if instance already exists
  const existing = await db.dailyChallengeInstance.findUnique({
    where: {
      challengeDate_gradeLevel: {
        challengeDate: normalizedDate,
        gradeLevel: 'All Levels',
      },
    },
    include: { quiz: true },
  });

  if (existing) {
    return {
      instanceId: existing.id,
      quizId: existing.quizId,
      quizSlug: existing.quiz.slug,
      isExisting: true,
    };
  }

  // Determine weekday (0 = Sun, 1 = Mon, ..., 6 = Sat)
  const dayOfWeek = date.getDay();

  // Find schedule rule
  let schedule = await db.dailyChallengeSchedule.findFirst({
    where: { dayOfWeek },
  });

  if (!schedule) {
    // Fallback to any schedule
    schedule = await db.dailyChallengeSchedule.findFirst();
  }

  if (!schedule) {
    throw new Error('No daily challenge schedule configured in database.');
  }

  // Get author (Riffat)
  const author = await db.user.findFirst({
    where: { roles: { some: { role: 'SUPER_ADMIN' } } },
  });

  if (!author) {
    throw new Error('Author not found.');
  }

  // Query eligible questions for this topic
  let questions = await db.question.findMany({
    where: {
      topicId: schedule.topicId,
      isArchived: false,
    },
    take: schedule.questionCount,
    orderBy: { createdAt: 'asc' },
  });

  // If not enough questions, fetch general questions as fallback
  if (questions.length === 0) {
    questions = await db.question.findMany({
      where: { isArchived: false },
      take: 5,
    });
  }

  const slug = `daily-challenge-${dateString}`;
  const title = `Daily Grammar Challenge — ${new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Dhaka',
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).format(date)}`;

  // Create quiz and instance inside transaction to guarantee idempotency
  const result = await db.$transaction(async (tx) => {
    const quiz = await tx.quiz.create({
      data: {
        title,
        slug,
        description: 'Today\'s 5-minute English grammar brain workout. Keep your learning streak alive!',
        subjectId: questions[0].subjectId,
        topicId: schedule.topicId,
        authorId: author.id,
        accessMode: QuizAccessMode.PUBLIC_GUEST,
        resultVisibility: ResultVisibility.IMMEDIATE,
        durationMinutes: 10,
        passingScorePercent: 60.0,
        isPublished: true,
        isDailyChallenge: true,
        questions: {
          create: questions.map((q, idx) => ({
            questionId: q.id,
            points: q.points,
            orderIndex: idx + 1,
          })),
        },
      },
    });

    const instance = await tx.dailyChallengeInstance.create({
      data: {
        scheduleId: schedule.id,
        challengeDate: normalizedDate,
        gradeLevel: 'All Levels',
        quizId: quiz.id,
      },
    });

    return { instance, quiz };
  });

  return {
    instanceId: result.instance.id,
    quizId: result.quiz.id,
    quizSlug: result.quiz.slug,
    isExisting: false,
  };
}

