import { requireAdmin } from '@/features/auth/guards';
import { db } from '@/lib/db';
import Link from 'next/link';
import {
  ShieldAlert,
  Users,
  Settings,
  Sparkles,
  BookOpen,
  GraduationCap,
  Award,
  Bell,
  ArrowRight
} from 'lucide-react';

export default async function AdminDashboardPage() {
  await requireAdmin();

  const [
    usersCount,
    lessonsCount,
    coursesCount,
    quizzesCount,
    attemptsCount,
    noticesCount,
    settings,
  ] = await Promise.all([
    db.user.count(),
    db.lesson.count(),
    db.course.count(),
    db.quiz.count(),
    db.quizAttempt.count(),
    db.notice.count(),
    db.siteSetting.findMany(),
  ]);

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 text-pink-700 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Platform Administration</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              System Console & Platform Settings
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Global operations, user management, daily schedules, and platform settings.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/site-settings"
              className="px-4 py-2.5 bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              <span>Site Settings</span>
            </Link>
          </div>
        </div>

        {/* Global Platform Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <p className="text-xs font-bold text-slate-400 uppercase">Users</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{usersCount}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <p className="text-xs font-bold text-slate-400 uppercase">Lessons</p>
            <p className="text-2xl font-black text-teal-800 mt-1">{lessonsCount}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <p className="text-xs font-bold text-slate-400 uppercase">Courses</p>
            <p className="text-2xl font-black text-pink-600 mt-1">{coursesCount}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <p className="text-xs font-bold text-slate-400 uppercase">Quizzes</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{quizzesCount}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <p className="text-xs font-bold text-slate-400 uppercase">Attempts</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">{attemptsCount}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <p className="text-xs font-bold text-slate-400 uppercase">Notices</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{noticesCount}</p>
          </div>
        </div>

        {/* Admin Navigation Panels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/admin/daily-challenge"
            className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:border-pink-300 card-hover-lift block space-y-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-pink-50 border border-pink-200 flex items-center justify-center text-pink-600">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">
              Daily Challenge Scheduler
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Configure weekly recurring grammar topics for each day (Monday–Sunday) and trigger test challenge generation.
            </p>
          </Link>

          <Link
            href="/admin/site-settings"
            className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:border-teal-300 card-hover-lift block space-y-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800">
              <Settings className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">
              Site & Branding Configuration
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Edit tagline, YouTube channels, contact emails, and social links without changing application source code.
            </p>
          </Link>

          <Link
            href="/admin/users"
            className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:border-amber-300 card-hover-lift block space-y-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">
              User & Role Management
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              View all registered users and assign Super Admin, Teacher, or Student roles with server-side authorization.
            </p>
          </Link>
        </div>

      </div>
    </div>
  );
}

