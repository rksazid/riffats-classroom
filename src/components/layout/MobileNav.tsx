'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  BookOpen,
  Sparkles,
  Trophy,
  MessageSquare,
  Bell,
  HelpCircle,
  LayoutDashboard,
  LogIn,
  LogOut,
  Compass,
} from 'lucide-react';
import { signOutAction } from '@/features/auth/actions';

interface MobileNavProps {
  user: {
    id: string;
    name: string;
    email: string;
    gradeLevel?: string | null;
    roles: string[];
  } | null;
  isTeacherOrAdmin: boolean;
}

export default function MobileNav({ user, isTeacherOrAdmin }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggle = () => setIsOpen((prev) => !prev);
  const close = () => setIsOpen(false);

  const navLinks = [
    { href: '/lessons', label: 'Lessons', icon: BookOpen },
    { href: '/courses', label: 'Courses', icon: Compass },
    {
      href: '/daily-challenge',
      label: 'Daily Challenge',
      icon: Sparkles,
      highlight: true,
    },
    { href: '/quizzes', label: 'Quizzes & Exams', icon: Trophy },
    { href: '/community', label: 'Community', icon: MessageSquare },
    { href: '/notices', label: 'Notices', icon: Bell },
    { href: '/about', label: 'About', icon: HelpCircle },
  ];

  return (
    <div className="lg:hidden flex items-center gap-2">
      {/* Mobile Menu Hamburger Button */}
      <button
        type="button"
        onClick={toggle}
        aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        className="p-2 rounded-xl text-slate-700 hover:text-teal-800 hover:bg-slate-100 transition-colors focus:outline-hidden focus:ring-2 focus:ring-teal-700"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Slide-down Mobile Navigation Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 top-20 bg-slate-900/40 backdrop-blur-xs z-40 transition-opacity"
            onClick={close}
            aria-hidden="true"
          />

          {/* Panel */}
          <div className="fixed top-20 inset-x-0 bg-white border-b border-slate-200 shadow-2xl z-50 p-5 space-y-4 max-h-[calc(100vh-80px)] overflow-y-auto animate-in fade-in slide-in-from-top-4 duration-150">
            {/* Navigation Links */}
            <nav className="grid grid-cols-1 gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={close}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                      isActive
                        ? 'bg-teal-50 text-teal-800 font-extrabold'
                        : link.highlight
                          ? 'text-pink-600 hover:bg-pink-50'
                          : 'text-slate-700 hover:text-teal-800 hover:bg-slate-50'
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 shrink-0 ${
                        link.highlight
                          ? 'text-pink-500 animate-pulse'
                          : isActive
                            ? 'text-teal-700'
                            : 'text-slate-400'
                      }`}
                    />
                    <span className="whitespace-nowrap">{link.label}</span>
                    {link.highlight && (
                      <span className="ml-auto text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-pink-100 text-pink-700">
                        New
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            <hr className="border-slate-100" />

            {/* Mobile Auth Actions */}
            {user ? (
              <div className="space-y-3 pt-1">
                <div className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-black text-slate-900 truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-teal-700 font-medium truncate">
                      {user.gradeLevel || user.roles[0]}
                    </p>
                  </div>
                  <form action={signOutAction} className="shrink-0">
                    <button
                      type="submit"
                      onClick={close}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </form>
                </div>

                <Link
                  href={isTeacherOrAdmin ? '/teacher/dashboard' : '/student/dashboard'}
                  onClick={close}
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-sm font-black text-white bg-teal-800 hover:bg-teal-900 transition-colors shadow-sm"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>{isTeacherOrAdmin ? 'Teacher Portal' : 'My Student Dashboard'}</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-1">
                <Link
                  href="/sign-in"
                  onClick={close}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-slate-700 hover:text-teal-800 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>
                <Link
                  href="/daily-challenge"
                  onClick={close}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-pink-600 hover:bg-pink-700 transition-colors shadow-sm"
                >
                  <span>Start Learning</span>
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
