import Link from 'next/link';
import Image from 'next/image';
import { getCurrentUser } from '@/lib/auth';
import { signOutAction } from '@/features/auth/actions';
import { Role } from '@prisma/client';
import { Sparkles, LayoutDashboard, LogIn, LogOut } from 'lucide-react';
import MobileNav from './MobileNav';

export default async function Navbar() {
  const user = await getCurrentUser();

  const isTeacherOrAdmin = Boolean(
    user?.roles.some((r) =>
      ([Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER] as Role[]).includes(r)
    )
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* 1. Brand Logo & Name (Guaranteed Never to Wrap) */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden shadow-xs ring-2 ring-pink-500/25 group-hover:ring-pink-500 transition-all shrink-0 bg-teal-900 flex items-center justify-center">
            <Image
              src="/images/logo.png"
              alt="Riffat's Classroom Logo"
              width={44}
              height={44}
              className="object-cover w-full h-full"
              priority
            />
          </div>
          <div className="flex flex-col shrink-0 leading-tight">
            <span className="font-black text-base sm:text-lg xl:text-xl tracking-tight text-slate-900 group-hover:text-teal-800 transition-colors whitespace-nowrap">
              Riffat&apos;s <span className="text-pink-600">Classroom</span>
            </span>
            <span className="text-[10px] font-bold text-teal-700 tracking-wider uppercase whitespace-nowrap">
              English Learning LMS
            </span>
          </div>
        </Link>

        {/* 2. Desktop Navigation Links (Visible on lg+, Never Wrap) */}
        <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1.5 shrink-0">
          <Link
            href="/lessons"
            className="px-2.5 xl:px-3 py-1.5 xl:py-2 text-xs xl:text-sm font-semibold text-slate-700 hover:text-teal-800 hover:bg-teal-50/80 rounded-xl transition-colors whitespace-nowrap"
          >
            Lessons
          </Link>
          <Link
            href="/courses"
            className="px-2.5 xl:px-3 py-1.5 xl:py-2 text-xs xl:text-sm font-semibold text-slate-700 hover:text-teal-800 hover:bg-teal-50/80 rounded-xl transition-colors whitespace-nowrap"
          >
            Courses
          </Link>
          <Link
            href="/daily-challenge"
            className="flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 xl:py-2 text-xs xl:text-sm font-bold text-pink-600 hover:text-pink-700 hover:bg-pink-50 rounded-xl transition-colors whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-pink-500" />
            <span>Daily Challenge</span>
          </Link>
          <Link
            href="/quizzes"
            className="px-2.5 xl:px-3 py-1.5 xl:py-2 text-xs xl:text-sm font-semibold text-slate-700 hover:text-teal-800 hover:bg-teal-50/80 rounded-xl transition-colors whitespace-nowrap"
          >
            <span>Quizzes</span>
            <span className="hidden xl:inline"> &amp; Exams</span>
          </Link>
          <Link
            href="/community"
            className="px-2.5 xl:px-3 py-1.5 xl:py-2 text-xs xl:text-sm font-semibold text-slate-700 hover:text-teal-800 hover:bg-teal-50/80 rounded-xl transition-colors whitespace-nowrap"
          >
            Community
          </Link>
          <Link
            href="/notices"
            className="px-2.5 xl:px-3 py-1.5 xl:py-2 text-xs xl:text-sm font-semibold text-slate-700 hover:text-teal-800 hover:bg-teal-50/80 rounded-xl transition-colors whitespace-nowrap"
          >
            Notices
          </Link>
          <Link
            href="/about"
            className="px-2.5 xl:px-3 py-1.5 xl:py-2 text-xs xl:text-sm font-semibold text-slate-700 hover:text-teal-800 hover:bg-teal-50/80 rounded-xl transition-colors whitespace-nowrap"
          >
            About
          </Link>
        </nav>

        {/* 3. User Session Actions & Mobile Hamburger */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {user ? (
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <Link
                href={isTeacherOrAdmin ? '/teacher/dashboard' : '/student/dashboard'}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold text-white bg-teal-800 hover:bg-teal-900 rounded-xl shadow-xs transition-colors shrink-0 whitespace-nowrap"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>{isTeacherOrAdmin ? 'Teacher Portal' : 'My Dashboard'}</span>
              </Link>

              {/* User details shown on wider screens (xl+), cleanly truncated */}
              <div className="hidden xl:flex flex-col text-right shrink-0 max-w-[130px] leading-tight">
                <span className="text-xs font-black text-slate-900 truncate">
                  {user.name}
                </span>
                <span className="text-[10px] font-semibold text-teal-700 truncate">
                  {user.gradeLevel || (isTeacherOrAdmin ? 'Teacher' : 'Student')}
                </span>
              </div>

              <form action={signOutAction} className="shrink-0">
                <button
                  type="submit"
                  title="Sign Out"
                  aria-label="Sign Out"
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/sign-in"
                className="flex items-center gap-1.5 px-3 sm:px-3.5 py-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-teal-800 hover:bg-teal-50/80 rounded-xl transition-colors shrink-0 whitespace-nowrap"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </Link>
              <Link
                href="/daily-challenge"
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-bold text-white bg-pink-600 hover:bg-pink-700 rounded-xl shadow-xs transition-all shrink-0 whitespace-nowrap"
              >
                <span>Start Learning</span>
              </Link>
            </div>
          )}

          {/* Responsive Mobile Drawer Component (< lg) */}
          <MobileNav
            user={
              user
                ? {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    gradeLevel: user.gradeLevel,
                    roles: user.roles,
                  }
                : null
            }
            isTeacherOrAdmin={isTeacherOrAdmin}
          />
        </div>

      </div>
    </header>
  );
}
