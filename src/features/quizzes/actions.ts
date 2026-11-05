'use server';

import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { evaluateQuestion } from './engine';
import { AttemptStatus } from '@prisma/client';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function startQuizAttemptAction(quizId: string, guestNickname?: string) {
  const user = await getCurrentUser();

  const quiz = await db.quiz.findUnique({
    where: { id: quizId },
    include: { questions: true },
  });

  if (!quiz || !quiz.isPublished) {
    throw new Error('Assessment not available or unpublished.');
  }

  // Calculate authoritative expiry if timed
  const startedAt = new Date();
  const expiresAt = quiz.durationMinutes
    ? new Date(startedAt.getTime() + quiz.durationMinutes * 60 * 1000)
    : null;

  const totalPossible = quiz.questions.reduce((sum, q) => sum + q.points, 0);

  const attempt = await db.quizAttempt.create({
    data: {
      quizId,
      userId: user ? user.id : null,
      guestNickname: user ? null : guestNickname || 'Guest Learner',
      status: AttemptStatus.IN_PROGRESS,
      startedAt,
      expiresAt,
      totalPossible,
    },
  });

  return { attemptId: attempt.id, expiresAt: expiresAt?.toISOString() };
}

export async function saveQuizAnswerAction(
  attemptId: string,
  questionId: string,
  selectedOptionKeys: string[],
  textAnswer?: string
) {
  const attempt = await db.quizAttempt.findUnique({
    where: { id: attemptId },
  });

  if (!attempt || attempt.status !== AttemptStatus.IN_PROGRESS) {
    throw new Error('Attempt is already finalized or expired.');
  }

  // Check server-side time limit with 30-second network grace window
  if (attempt.expiresAt) {
    const graceExpiry = new Date(attempt.expiresAt.getTime() + 30 * 1000);
    if (new Date() > graceExpiry) {
      await db.quizAttempt.update({
        where: { id: attemptId },
        data: { status: AttemptStatus.EXPIRED },
      });
      throw new Error('Time has expired for this examination.');
    }
  }

  await db.attemptAnswer.upsert({
    where: {
      attemptId_questionId: {
        attemptId,
        questionId,
      },
    },
    update: {
      selectedOptionKeys,
      textAnswer: textAnswer || null,
      updatedAt: new Date(),
    },
    create: {
      attemptId,
      questionId,
      selectedOptionKeys,
      textAnswer: textAnswer || null,
    },
  });

  return { success: true };
}

export async function submitQuizAttemptAction(attemptId: string) {
  const attempt = await db.quizAttempt.findUnique({
    where: { id: attemptId },
    include: {
      quiz: {
        include: {
          questions: {
            include: {
              question: {
                include: { options: true },
              },
            },
          },
        },
      },
      answers: true,
    },
  });

  if (!attempt) {
    throw new Error('Attempt not found.');
  }

  if (attempt.status === AttemptStatus.GRADED) {
    return { attemptId: attempt.id, quizSlug: attempt.quiz.slug };
  }

  let totalScoreEarned = 0;
  const totalPossible = attempt.quiz.questions.reduce((sum, q) => sum + q.points, 0);

  // Grade each question
  for (const qq of attempt.quiz.questions) {
    const studentAnswer = attempt.answers.find((a) => a.questionId === qq.questionId);
    const correctOptions = qq.question.options
      .filter((o) => o.isCorrect)
      .map((o) => o.optionKey);

    const result = evaluateQuestion({
      questionId: qq.questionId,
      type: qq.question.type,
      points: qq.points,
      selectedOptionKeys: studentAnswer?.selectedOptionKeys || [],
      textAnswer: studentAnswer?.textAnswer,
      correctOptionKeys: correctOptions,
      correctText: null,
    });

    totalScoreEarned += result.awardedMarks;

    // Update answer record
    if (studentAnswer) {
      await db.attemptAnswer.update({
        where: { id: studentAnswer.id },
        data: {
          isCorrect: result.isCorrect,
          awardedMarks: result.awardedMarks,
        },
      });
    } else {
      await db.attemptAnswer.create({
        data: {
          attemptId,
          questionId: qq.questionId,
          selectedOptionKeys: [],
          isCorrect: false,
          awardedMarks: 0,
        },
      });
    }
  }

  const percentage = totalPossible > 0 ? (totalScoreEarned / totalPossible) * 100 : 0;
  const isPassed = percentage >= attempt.quiz.passingScorePercent;

  await db.quizAttempt.update({
    where: { id: attemptId },
    data: {
      status: AttemptStatus.GRADED,
      scoreEarned: totalScoreEarned,
      totalPossible,
      percentage,
      isPassed,
      submittedAt: new Date(),
    },
  });

  // Update student streak if user is logged in
  if (attempt.userId) {
    const today = new Date();
    await db.studentStreak.upsert({
      where: { userId: attempt.userId },
      update: {
        currentStreak: { increment: 1 },
        totalChallengesCompleted: { increment: 1 },
        lastActiveDate: today,
      },
      create: {
        userId: attempt.userId,
        currentStreak: 1,
        longestStreak: 1,
        totalChallengesCompleted: 1,
        lastActiveDate: today,
      },
    });
  }

  return { attemptId: attempt.id, quizSlug: attempt.quiz.slug };
}

export async function createQuizAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/sign-in');
  }

  const title = (formData.get('title') as string)?.trim();
  const description = (formData.get('description') as string)?.trim();
  const topicId = formData.get('topicId') as string;
  const durationMinutes = formData.get('durationMinutes')
    ? parseInt(formData.get('durationMinutes') as string)
    : null;
  const passingScorePercent = parseFloat(formData.get('passingScorePercent') as string) || 60.0;
  const accessMode = (formData.get('accessMode') as any) || 'PUBLIC_GUEST';
  const selectedQuestionIds = formData.getAll('questionIds') as string[];

  if (!title || selectedQuestionIds.length === 0) {
    throw new Error('Title and at least one selected question are required.');
  }

  const topic = await db.topic.findUnique({ where: { id: topicId } });
  const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50)}-${Date.now()}`;

  const quiz = await db.quiz.create({
    data: {
      title,
      slug,
      description,
      subjectId: topic?.subjectId || (await db.subject.findFirst())!.id,
      topicId: topicId || null,
      authorId: user.id,
      durationMinutes,
      passingScorePercent,
      accessMode,
      isPublished: true,
      questions: {
        create: selectedQuestionIds.map((qId, idx) => ({
          questionId: qId,
          points: 1.0,
          orderIndex: idx + 1,
        })),
      },
    },
  });

  revalidatePath('/quizzes');
  revalidatePath('/teacher/quizzes');
  redirect(`/teacher/quizzes`);
}


