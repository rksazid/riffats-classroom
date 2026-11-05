import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { notFound } from 'next/navigation';
import QuizPlayer from '@/features/quizzes/QuizPlayer';
import { AttemptStatus } from '@prisma/client';
import { startQuizAttemptAction } from '@/features/quizzes/actions';

interface QuizSlugProps {
  params: Promise<{ slug: string }>;
}

export default async function QuizAttemptPage({ params }: QuizSlugProps) {
  const { slug } = await params;
  const user = await getCurrentUser();

  const quiz = await db.quiz.findUnique({
    where: { slug },
    include: {
      questions: {
        orderBy: { orderIndex: 'asc' },
        include: {
          question: {
            include: {
              options: {
                orderBy: { orderIndex: 'asc' },
              },
            },
          },
        },
      },
    },
  });

  if (!quiz || !quiz.isPublished) {
    notFound();
  }

  // Look for existing IN_PROGRESS attempt to resume
  let activeAttempt = user
    ? await db.quizAttempt.findFirst({
        where: {
          quizId: quiz.id,
          userId: user.id,
          status: AttemptStatus.IN_PROGRESS,
        },
        orderBy: { startedAt: 'desc' },
      })
    : null;

  // If no active attempt, create a new one
  if (!activeAttempt) {
    const startedAt = new Date();
    const expiresAt = quiz.durationMinutes
      ? new Date(startedAt.getTime() + quiz.durationMinutes * 60 * 1000)
      : null;

    const totalPossible = quiz.questions.reduce((sum, q) => sum + q.points, 0);

    activeAttempt = await db.quizAttempt.create({
      data: {
        quizId: quiz.id,
        userId: user ? user.id : null,
        guestNickname: user ? null : 'Guest Learner',
        status: AttemptStatus.IN_PROGRESS,
        startedAt,
        expiresAt,
        totalPossible,
      },
    });
  }

  // SANITIZE QUESTIONS: NEVER leak correct options or explanations to client!
  const sanitizedQuestions = quiz.questions.map((qq) => ({
    id: qq.question.id,
    type: qq.question.type,
    passageText: qq.question.passageText,
    questionText: qq.question.questionText,
    points: qq.points,
    options: qq.question.options.map((opt) => ({
      id: opt.id,
      optionKey: opt.optionKey,
      optionText: opt.optionText,
      orderIndex: opt.orderIndex,
    })),
  }));

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <QuizPlayer
          quizTitle={quiz.title}
          quizSlug={quiz.slug}
          durationMinutes={quiz.durationMinutes}
          attemptId={activeAttempt.id}
          initialExpiresAt={activeAttempt.expiresAt?.toISOString() || null}
          questions={sanitizedQuestions}
        />
      </div>
    </div>
  );
}

