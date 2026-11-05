import Link from 'next/link';
import Image from 'next/image';
import { getCurrentUser } from '@/lib/auth';
import { signOutAction } from '@/features/auth/actions';
import { Role } from '@prisma/client';
import { BookOpen, Sparkles, Trophy, MessageSquare, Bell, LogIn, LogOut, LayoutDashboard, Menu } from 'lucide-react';

export default async function Navbar() {
  const user = await getCurrentUser();

  const isTeacherOrAdmin = user?.roles.some((r) =>
    ([Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER] as Role[]).includes(r)
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-xs ring-2 ring-pink-500/20 group-hover:ring-pink-500 transition-all">
            <Image
              src="/images/logo.png"
              alt="Riffat's Classroom Logo"
              width={48}
              height={48}
              className="object-cover"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-teal-800 transition-colors">
              Riffat&apos;s <span className="text-pink-600">Classroom</span>
            </span>
            <span className="text-xs font-semibold text-teal-700 tracking-wider uppercase">
              English Learning LMS
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <Link
            href="/lessons"
            className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
          >
            Lessons
          </Link>
          <Link
            href="/courses"
            className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
          >
            Courses
          </Link>
          <Link
            href="/daily-challenge"
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-pink-600 hover:text-pink-700 hover:bg-pink-50 rounded-lg transition-colors"
          >
            <Sparkles className="w-4 h-4 animate-pulse" />
            Daily Challenge
          </Link>
          <Link
            href="/quizzes"
            className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
          >
            Quizzes & Exams
          </Link>
          <Link
            href="/community"
            className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
          >
            Community
          </Link>
          <Link
            href="/notices"
            className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
          >
            Notices
          </Link>
          <Link
            href="/about"
            className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
          >
            About
          </Link>
        </nav>

        {/* User Session Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href={isTeacherOrAdmin ? '/teacher/dashboard' : '/student/dashboard'}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-teal-800 hover:bg-teal-900 rounded-xl shadow-xs transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>{isTeacherOrAdmin ? 'Teacher Portal' : 'My Dashboard'}</span>
              </Link>

              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-bold text-slate-900 leading-tight">
                  {user.name}
                </span>
                <span className="text-[11px] font-medium text-teal-700">
                  {user.gradeLevel || user.roles[0]}
                </span>
              </div>

              <form action={signOutAction}>
                <button
                  type="submit"
                  title="Sign Out"
                  aria-label="Sign Out"
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/sign-in"
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 hover:text-teal-800 hover:bg-teal-50 rounded-xl transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </Link>
              <Link
                href="/daily-challenge"
                className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-pink-600 hover:bg-pink-700 rounded-xl shadow-sm transition-all"
              >
                <span>Start Learning</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
