'use client';

import { useState, useEffect } from 'react';
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

  // Close on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

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
    <div className="lg:hidden flex items-center">
      {/* Mobile Menu Hamburger Button */}
      <button
        type="button"
        onClick={toggle}
        aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        className="p-2 -mr-1 rounded-xl text-slate-700 hover:text-teal-800 hover:bg-slate-100 transition-colors focus:outline-hidden focus:ring-2 focus:ring-teal-700"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Slide-down Mobile Navigation Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 top-16 sm:top-20 bg-slate-900/50 backdrop-blur-xs z-40 transition-opacity"
            onClick={close}
            aria-hidden="true"
          />

          {/* Panel */}
          <div className="fixed top-16 sm:top-20 inset-x-0 bg-white border-b border-slate-200 shadow-2xl z-50 p-4 sm:p-6 space-y-4 max-h-[calc(100vh-64px)] sm:max-h-[calc(100vh-80px)] overflow-y-auto animate-in fade-in slide-in-from-top-3 duration-150">
            {/* User Card (If Authenticated) */}
            {user && (
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-black text-slate-900 truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-teal-700 font-semibold truncate">
                    {user.gradeLevel || user.roles?.[0] || 'Member'}
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
            )}

            {/* Portal Action for Authenticated User */}
            {user && (
              <Link
                href={isTeacherOrAdmin ? '/teacher/dashboard' : '/student/dashboard'}
                onClick={close}
                className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-sm font-black text-white bg-teal-800 hover:bg-teal-900 transition-colors shadow-xs"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>{isTeacherOrAdmin ? 'Teacher Portal' : 'My Student Dashboard'}</span>
              </Link>
            )}

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
                        Daily
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Auth Actions (If Not Authenticated) */}
            {!user && (
              <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-3">
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
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-pink-600 hover:bg-pink-700 transition-colors shadow-xs"
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
