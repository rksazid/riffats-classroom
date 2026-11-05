import { requireUser } from '@/features/auth/guards';
import { db } from '@/lib/db';
import Link from 'next/link';
import { Award, CheckCircle2, Clock, Sparkles, ArrowRight, RotateCcw } from 'lucide-react';
import { formatDhakaDateOnly } from '@/lib/timezone';

export default async function StudentQuizzesPage() {
  const user = await requireUser();

  const [attempts, availableQuizzes] = await Promise.all([
    db.quizAttempt.findMany({
      where: { userId: user.id },
      orderBy: { startedAt: 'desc' },
      include: {
        quiz: {
          include: { topic: true },
        },
      },
    }),
    db.quiz.findMany({
      where: { isPublished: true },
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: {
        topic: true,
        questions: true,
      },
    }),
  ]);

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm">
          <div>
            <span className="text-xs font-bold text-pink-600 uppercase tracking-wider block">
              Assessment Center
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              My Quizzes & Exam Results
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Review your quiz scores, teacher feedback, and test yourself on new grammar topics.
            </p>
          </div>

          <Link
            href="/daily-challenge"
            className="px-5 py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Sparkles className="w-4 h-4" />
            <span>Daily Challenge</span>
          </Link>
        </div>

        {/* Recent Attempts History */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">
            Attempt History ({attempts.length})
          </h2>

          {attempts.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <Award className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-700">No quizzes completed yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Test your skills on any of the grammar assessments below to get instant feedback!
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {attempts.map((att) => (
                <div
                  key={att.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-teal-50 text-teal-800">
                      {att.quiz.topic?.name || 'Grammar'}
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900">
                      {att.quiz.title}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Completed on {formatDhakaDateOnly(att.submittedAt || att.startedAt)} • {att.totalPossible} Total Marks
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                        att.isPassed
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {att.scoreEarned} / {att.totalPossible} ({att.percentage.toFixed(0)}%) • {att.isPassed ? 'Passed' : 'Review'}
                    </span>

                    <Link
                      href={`/quizzes/${att.quiz.slug}/results/${att.id}`}
                      className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
                    >
                      <span>Review Answers</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recommended Quizzes */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900">
            Available Practice Quizzes
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {availableQuizzes.map((q) => (
              <div
                key={q.id}
                className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between card-hover-lift space-y-4"
              >
                <div>
                  <span className="text-[10px] font-bold text-pink-600 uppercase">
                    {q.topic?.name || 'General English'}
                  </span>
                  <h3 className="text-sm font-extrabold text-slate-900 mt-1 leading-snug">
                    {q.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {q.questions.length} Questions • {q.durationMinutes || 10} Mins
                  </p>
                </div>

                <Link
                  href={`/quizzes/${q.slug}`}
                  className="w-full py-2 bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold text-center rounded-xl transition-colors block"
                >
                  Start Quiz
                </Link>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
