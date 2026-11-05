import { getOrCreateDailyChallenge } from '@/features/daily-challenge/generator';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import Link from 'next/link';
import {
  Sparkles,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { formatDhakaWeekdayDate } from '@/lib/timezone';

export default async function DailyChallengeLandingPage() {
  const user = await getCurrentUser();

  // Retrieve today's challenge
  const challenge = await getOrCreateDailyChallenge();

  const [quiz, schedules, streak] = await Promise.all([
    db.quiz.findUnique({
      where: { id: challenge.quizId },
      include: {
        topic: true,
        questions: true,
      },
    }),
    db.dailyChallengeSchedule.findMany({
      orderBy: { dayOfWeek: 'asc' },
      include: { topic: true },
    }),
    user
      ? db.studentStreak.findUnique({
          where: { userId: user.id },
        })
      : null,
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
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-50 text-pink-700 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>Signature Feature</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Daily Grammar Challenge
          </h1>
          <p className="text-sm text-slate-600">
            5 questions every day. Build vocabulary, polish sentence structure, and never lose your English practice habit!
          </p>
        </div>

        {/* Today's Challenge Big Hero Card */}
        {quiz && (
          <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10 space-y-4 max-w-2xl">
              <div className="flex items-center gap-2 text-pink-400 text-xs font-bold uppercase tracking-wider">
                <Calendar className="w-4 h-4" />
                <span>{formatDhakaWeekdayDate(new Date())}</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black leading-tight">
                {quiz.title}
              </h2>

              <p className="text-sm text-slate-300 leading-relaxed">
                Topic:{' '}
                <strong className="text-white font-bold">
                  {quiz.topic?.name || 'Daily Grammar Review'}
                </strong>{' '}
                • 5 curated questions crafted to test both rules and practical sentence usage.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-3 text-xs max-w-md">
                <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs">
                  <p className="text-slate-300">Questions</p>
                  <p className="text-base font-extrabold text-white">
                    {quiz.questions.length} Items
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs">
                  <p className="text-slate-300">Time Limit</p>
                  <p className="text-base font-extrabold text-white">
                    {quiz.durationMinutes || 10} Mins
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs col-span-2 sm:col-span-1">
                  <p className="text-slate-300">Passing Score</p>
                  <p className="text-base font-extrabold text-pink-400">
                    60%
                  </p>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <Link
                  href={`/quizzes/${quiz.slug}`}
                  className="px-8 py-3.5 bg-pink-600 hover:bg-pink-500 text-white font-extrabold text-sm rounded-xl shadow-lg transition-all flex items-center gap-2 group"
                >
                  <Sparkles className="w-5 h-5 text-pink-200 group-hover:rotate-12 transition-transform" />
                  <span>Start Challenge Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                {!user && (
                  <span className="text-xs text-slate-300">
                    Guest mode enabled! Sign in anytime to track your streaks.
                  </span>
                )}
              </div>
            </div>

            <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 opacity-10 pointer-events-none">
              <Sparkles className="w-96 h-96 text-white" />
            </div>
          </div>
        )}

        {/* Student Streak Preview (If signed in) */}
        {user && streak && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-pink-50 border border-pink-200 flex items-center justify-center text-pink-600">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-slate-400">Your Current Streak</p>
                <p className="text-xl font-extrabold text-slate-900">
                  {streak.currentStreak} Days in a Row! 🔥
                </p>
              </div>
            </div>
            <Link
              href="/student/dashboard"
              className="text-xs font-bold text-teal-800 hover:text-teal-900"
            >
              View dashboard progress →
            </Link>
          </div>
        )}

        {/* Weekly Topic Schedule */}
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-xl font-extrabold text-slate-900">
              Weekly Grammar Topic Schedule
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Every day of the week focuses on a key foundation of English language learning.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {schedules.map((item) => {
              const dayName = daysOfWeekNames[item.dayOfWeek];
              const isToday = new Date().getDay() === item.dayOfWeek;

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isToday
                      ? 'bg-pink-50/80 border-pink-300 ring-2 ring-pink-500/20'
                      : 'bg-slate-50 border-slate-200/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-700">
                      {dayName}
                    </span>
                    {isToday && (
                      <span className="px-2 py-0.5 rounded-full bg-pink-600 text-white text-[10px] font-extrabold">
                        Today
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-900">
                    {item.topic.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {item.questionCount} Questions • {item.difficulty}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

