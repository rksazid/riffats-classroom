import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Award, CheckCircle2, XCircle, Sparkles, ArrowRight, BookOpen, RotateCcw } from 'lucide-react';
import ConfettiTrigger from '@/components/common/ConfettiTrigger';

interface ResultsPageProps {
  params: Promise<{ slug: string; attemptId: string }>;
}

export default async function QuizResultsPage({ params }: ResultsPageProps) {
  const { slug, attemptId } = await params;

  const attempt = await db.quizAttempt.findUnique({
    where: { id: attemptId },
    include: {
      quiz: {
        include: {
          questions: {
            orderBy: { orderIndex: 'asc' },
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
    notFound();
  }

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      {attempt.isPassed && <ConfettiTrigger />}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Result Summary Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-xl text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center bg-teal-50 border border-teal-200">
            {attempt.isPassed ? (
              <Sparkles className="w-8 h-8 text-pink-600 animate-bounce" />
            ) : (
              <Award className="w-8 h-8 text-amber-600" />
            )}
          </div>

          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              attempt.isPassed
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            {attempt.isPassed ? 'Passed! Excellent Work' : 'Keep Practicing'}
          </span>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
            {attempt.quiz.title}
          </h1>

          <div className="flex items-center justify-center gap-6 py-4">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">Score</p>
              <p className="text-3xl font-black text-slate-900">
                {attempt.scoreEarned} <span className="text-sm text-slate-400">/ {attempt.totalPossible}</span>
              </p>
            </div>
            <div className="w-px h-10 bg-slate-200"></div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">Accuracy</p>
              <p className={`text-3xl font-black ${attempt.isPassed ? 'text-emerald-600' : 'text-amber-600'}`}>
                {attempt.percentage.toFixed(0)}%
              </p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
            {attempt.isPassed
              ? 'Great job! You have demonstrated strong understanding of these English grammar rules.'
              : 'Review the teacher explanations below to understand your errors and try again.'}
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/daily-challenge"
              className="px-5 py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              <span>Daily Challenge</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/lessons"
              className="px-5 py-2.5 bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>Back to Lessons</span>
            </Link>
          </div>
        </div>

        {/* Detailed Question Review & Explanations */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900">
            Detailed Review & Explanations
          </h2>

          {attempt.quiz.questions.map((qq, idx) => {
            const studentAns = attempt.answers.find((a) => a.questionId === qq.questionId);
            const isCorrect = studentAns?.isCorrect;
            const correctOpts = qq.question.options.filter((o) => o.isCorrect);

            return (
              <div
                key={qq.id}
                className={`p-6 sm:p-7 rounded-3xl border bg-white shadow-xs space-y-4 ${
                  isCorrect ? 'border-emerald-200' : 'border-amber-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">
                    Question {idx + 1}
                  </span>
                  <span
                    className={`text-xs font-extrabold px-2.5 py-1 rounded-md flex items-center gap-1 ${
                      isCorrect
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Correct (+{qq.points})</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Incorrect (0 / {qq.points})</span>
                      </>
                    )}
                  </span>
                </div>

                <p className="text-base font-bold text-slate-900 leading-snug">
                  {qq.question.questionText}
                </p>

                {/* Answer comparison */}
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="font-bold text-slate-500 block mb-0.5">Your Answer:</span>
                    <span className="font-semibold text-slate-900">
                      {studentAns?.selectedOptionKeys.join(', ') || studentAns?.textAnswer || 'No answer submitted'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-teal-50 border border-teal-200/80">
                    <span className="font-bold text-teal-800 block mb-0.5">Correct Answer:</span>
                    <span className="font-semibold text-teal-900">
                      {correctOpts.map((o) => `${o.optionKey}: ${o.optionText}`).join(' | ')}
                    </span>
                  </div>
                </div>

                {/* Teacher Explanation */}
                {qq.question.explanation && (
                  <div className="p-4 rounded-xl bg-pink-50/70 border border-pink-200 text-xs text-slate-800 space-y-1">
                    <div className="font-bold text-pink-700 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Teacher Riffat&apos;s Explanation:</span>
                    </div>
                    <p className="leading-relaxed text-slate-700">
                      {qq.question.explanation}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
