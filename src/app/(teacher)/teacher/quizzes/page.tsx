import { requireTeacher } from '@/features/auth/guards';
import { db } from '@/lib/db';
import Link from 'next/link';
import { Award, PlusCircle, Clock, Users, ArrowRight, CheckCircle2 } from 'lucide-react';
import { formatDhakaDateOnly } from '@/lib/timezone';

export default async function TeacherQuizzesPage() {
  await requireTeacher();

  const quizzes = await db.quiz.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      topic: true,
      questions: true,
      _count: { select: { attempts: true } },
    },
  });

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm">
          <div>
            <span className="text-xs font-bold text-pink-600 uppercase tracking-wider block">
              Assessment Management
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Quizzes & Examinations
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Create, schedule, and review timed exams and practice quizzes.
            </p>
          </div>

          <Link
            href="/teacher/quizzes/new"
            className="px-5 py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Assessment</span>
          </Link>
        </div>

        {/* Quizzes List */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="divide-y divide-slate-100">
            {quizzes.map((q) => (
              <div
                key={q.id}
                className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-pink-50 text-pink-700">
                      {q.topic?.name || 'General English'}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        q.isPublished
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {q.isPublished ? 'Published' : 'Draft'}
                    </span>
                    {q.isDailyChallenge && (
                      <span className="text-[10px] font-bold text-pink-600 uppercase">
                        • Daily Challenge
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900">
                    {q.title}
                  </h3>

                  <p className="text-xs text-slate-400">
                    {q.questions.length} Questions • {q.durationMinutes ? `${q.durationMinutes} Mins` : 'Untimed'} •{' '}
                    Passing Score: {q.passingScorePercent}%
                  </p>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-xs font-bold px-3 py-1 bg-slate-100 text-slate-700 rounded-lg">
                    {q._count.attempts} {q._count.attempts === 1 ? 'Attempt' : 'Attempts'}
                  </span>

                  <Link
                    href={`/quizzes/${q.slug}`}
                    className="px-3.5 py-1.5 border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg transition-colors"
                  >
                    Preview
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
