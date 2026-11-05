import { getCurrentUser } from '@/lib/auth';
import { requireUser } from '@/features/auth/guards';
import { db } from '@/lib/db';
import Link from 'next/link';
import {
  Sparkles,
  BookOpen,
  Award,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  MessageSquare,
  GraduationCap
} from 'lucide-react';
import { formatDhakaDateOnly } from '@/lib/timezone';

export default async function StudentDashboardPage() {
  const user = await requireUser();

  // Query student-specific data
  const [streak, enrollments, attempts, todayChallenge, unreadNotifications] = await Promise.all([
    db.studentStreak.findUnique({
      where: { userId: user.id },
    }),
    db.courseEnrollment.findMany({
      where: { userId: user.id },
      include: {
        course: {
          include: {
            modules: {
              include: { lessons: true },
            },
          },
        },
      },
    }),
    db.quizAttempt.findMany({
      where: { userId: user.id },
      take: 5,
      orderBy: { submittedAt: 'desc' },
      include: {
        quiz: true,
      },
    }),
    db.dailyChallengeInstance.findFirst({
      orderBy: { challengeDate: 'desc' },
      include: {
        quiz: {
          include: { questions: true },
        },
      },
    }),
    db.notification.count({
      where: { userId: user.id, isRead: false },
    }),
  ]);

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* 1. Header Banner */}
        <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-xs font-bold uppercase tracking-wider">
              <span>{user.gradeLevel || 'Student Member'}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black">
              Welcome back, {user.name}! 👋
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-xl">
              &ldquo;Little Lessons. Big Progress.&rdquo; Keep your daily habit going and tackle today&apos;s English grammar challenge.
            </p>
          </div>
          
          <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 opacity-10 pointer-events-none">
            <Sparkles className="w-80 h-80 text-white" />
          </div>
        </div>

        {/* 2. Key Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Daily Streak Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-pink-50 border border-pink-200 flex items-center justify-center text-pink-600 shrink-0">
              <Sparkles className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Daily Streak
              </p>
              <p className="text-2xl font-black text-slate-900">
                {streak?.currentStreak || 0} <span className="text-xs font-semibold text-slate-500">Days</span>
              </p>
              <p className="text-[11px] text-pink-600 font-semibold">
                Best: {streak?.longestStreak || 0} days
              </p>
            </div>
          </div>

          {/* Challenges Completed */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800 shrink-0">
              <Award className="w-7 h-7 text-teal-700" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Challenges Solved
              </p>
              <p className="text-2xl font-black text-slate-900">
                {streak?.totalChallengesCompleted || 0}
              </p>
              <p className="text-[11px] text-teal-700 font-semibold">
                Grammar mastery
              </p>
            </div>
          </div>

          {/* Enrolled Courses */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700 shrink-0">
              <BookOpen className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Enrolled Courses
              </p>
              <p className="text-2xl font-black text-slate-900">
                {enrollments.length}
              </p>
              <p className="text-[11px] text-sky-700 font-semibold">
                Active learning paths
              </p>
            </div>
          </div>

          {/* Quizzes Taken */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Assessments Done
              </p>
              <p className="text-2xl font-black text-slate-900">
                {attempts.length}
              </p>
              <p className="text-[11px] text-emerald-700 font-semibold">
                Verified attempts
              </p>
            </div>
          </div>

        </div>

        {/* 3. Main Grid: Today's Challenge + Enrolled Courses */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Today's Challenge & Recent Quizzes */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Today's Challenge Card */}
            {todayChallenge && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-pink-200 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-ping" />
                    <span className="text-xs font-bold uppercase tracking-wider text-pink-600">
                      Today&apos;s Grammar Workout
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-400">
                    {formatDhakaDateOnly(todayChallenge.challengeDate)}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">
                  {todayChallenge.quiz.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mb-6">
                  {todayChallenge.quiz.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="text-xs text-slate-500 font-medium">
                    {todayChallenge.quiz.questions.length} Questions • {todayChallenge.quiz.durationMinutes || 10} Mins
                  </div>
                  <Link
                    href={`/quizzes/${todayChallenge.quiz.slug}`}
                    className="px-5 py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-2"
                  >
                    <span>Start Today&apos;s Challenge</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}

            {/* Recent Quiz Attempts */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900">
                  Recent Quiz Results
                </h3>
                <Link
                  href="/quizzes"
                  className="text-xs font-bold text-teal-800 hover:text-teal-900"
                >
                  Explore more quizzes →
                </Link>
              </div>

              {attempts.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No completed quizzes yet. Try a practice quiz or the daily challenge!
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {attempts.map((attempt) => (
                    <div key={attempt.id} className="py-3.5 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          {attempt.quiz.title}
                        </p>
                        <p className="text-xs text-slate-400">
                          {attempt.submittedAt ? formatDhakaDateOnly(attempt.submittedAt) : 'In Progress'}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                            attempt.isPassed
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {attempt.percentage.toFixed(0)}% • {attempt.isPassed ? 'Passed' : 'Review'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Active Courses & Shortcuts */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Active Enrolled Courses */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-900">
                My Enrolled Courses
              </h3>

              {enrollments.length === 0 ? (
                <div className="text-center py-8 space-y-3">
                  <p className="text-xs text-slate-500">
                    You have not enrolled in any recorded course yet.
                  </p>
                  <Link
                    href="/courses"
                    className="inline-block px-4 py-2 bg-teal-800 text-white font-bold text-xs rounded-xl"
                  >
                    Browse Courses
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {enrollments.map((enrollment) => (
                    <div
                      key={enrollment.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3"
                    >
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-100/60 px-2 py-0.5 rounded-sm">
                          {enrollment.status}
                        </span>
                        <h4 className="text-sm font-extrabold text-slate-900 mt-1">
                          {enrollment.course.title}
                        </h4>
                      </div>

                      <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                        <span className="text-xs text-slate-500 font-medium">
                          {enrollment.course.modules.length} Modules
                        </span>
                        <Link
                          href={`/courses/${enrollment.course.slug}`}
                          className="text-xs font-bold text-pink-600 hover:text-pink-700 flex items-center gap-1"
                        >
                          <span>Resume Learning</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Resource Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Link
                href="/community"
                className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-pink-300 card-hover-lift block"
              >
                <MessageSquare className="w-6 h-6 text-pink-600 mb-2" />
                <p className="text-xs font-bold text-slate-900">Grammar Forum</p>
                <p className="text-[11px] text-slate-500">Ask questions</p>
              </Link>

              <Link
                href="/student/certificates"
                className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-teal-300 card-hover-lift block"
              >
                <GraduationCap className="w-6 h-6 text-teal-700 mb-2" />
                <p className="text-xs font-bold text-slate-900">Certificates</p>
                <p className="text-[11px] text-slate-500">View awards</p>
              </Link>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
