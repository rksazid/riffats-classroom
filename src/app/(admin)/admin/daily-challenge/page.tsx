import { requireAdmin } from '@/features/auth/guards';
import { db } from '@/lib/db';
import { getOrCreateDailyChallenge } from '@/features/daily-challenge/generator';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Calendar, PlayCircle } from 'lucide-react';
import { formatDhakaDateOnly } from '@/lib/timezone';

async function triggerDailyChallengeAction() {
  'use server';
  await requireAdmin();
  await getOrCreateDailyChallenge();
  revalidatePath('/daily-challenge');
  revalidatePath('/admin/daily-challenge');
}

export default async function AdminDailyChallengePage() {
  await requireAdmin();

  const [schedules, instances] = await Promise.all([
    db.dailyChallengeSchedule.findMany({
      orderBy: { dayOfWeek: 'asc' },
      include: { topic: true },
    }),
    db.dailyChallengeInstance.findMany({
      take: 10,
      orderBy: { challengeDate: 'desc' },
      include: {
        quiz: {
          include: {
            questions: true,
            _count: { select: { attempts: true } },
          },
        },
      },
    }),
  ]);

  const daysOfWeekNames = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm">
          <div>
            <span className="text-xs font-bold text-pink-600 uppercase tracking-wider block">
              Automated Scheduling
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Daily Grammar Challenge Manager
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Manage weekly recurring schedules and monitor generated quiz instances.
            </p>
          </div>

          <form action={triggerDailyChallengeAction}>
            <button
              type="submit"
              className="px-5 py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Trigger Today&apos;s Challenge Generation</span>
            </button>
          </form>
        </div>

        {/* Weekly Recurring Schedule Table */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900">
            Weekly Topic Rules
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {schedules.map((s) => (
              <div key={s.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase">
                  {daysOfWeekNames[s.dayOfWeek]}
                </span>
                <p className="text-sm font-extrabold text-slate-900">
                  {s.topic.name}
                </p>
                <p className="text-[11px] text-slate-400">
                  {s.questionCount} Questions • {s.difficulty}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Generated Instances History */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900">
            Recent Generated Challenge Instances
          </h2>

          <div className="divide-y divide-slate-100">
            {instances.map((inst) => (
              <div key={inst.id} className="py-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-pink-600">
                      {formatDhakaDateOnly(inst.challengeDate)}
                    </span>
                    <span className="text-xs font-extrabold text-slate-900">
                      {inst.quiz.title}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {inst.quiz.questions.length} Questions • {inst.quiz._count.attempts} Student Attempts
                  </p>
                </div>

                <Link
                  href={`/quizzes/${inst.quiz.slug}`}
                  className="px-3.5 py-1.5 border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-lg transition-colors"
                >
                  View Quiz
                </Link>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

