import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { signInDemoAction, signInWithEmailAction } from '@/features/auth/actions';
import { ShieldCheck, UserCheck, Sparkles, BookOpen, GraduationCap } from 'lucide-react';
import Image from 'next/image';

export default async function SignInPage() {
  const currentUser = await getCurrentUser();
  if (currentUser) {
    if (currentUser.roles.some((r) => ['SUPER_ADMIN', 'ADMIN', 'TEACHER'].includes(r))) {
      redirect('/teacher/dashboard');
    } else {
      redirect('/student/dashboard');
    }
  }

  // Fetch demo users for convenient local/review testing
  const demoUsers = await db.user.findMany({
    include: { roles: true },
    orderBy: { createdAt: 'asc' },
  });

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/90 shadow-xl">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 rounded-2xl overflow-hidden ring-4 ring-pink-500/20 shadow-md">
            <Image
              src="/images/logo.png"
              alt="Riffat's Classroom"
              width={64}
              height={64}
              className="object-cover"
            />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Welcome to Riffat&apos;s Classroom
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Sign in to access your student dashboard, save quiz progress, or manage lessons.
          </p>
        </div>

        {/* Quick Demo Sign In Section */}
        <div className="bg-teal-50/60 p-4 rounded-2xl border border-teal-100 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-teal-800 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-pink-600" />
            <span>Select Account (Role Switcher)</span>
          </div>

          <div className="space-y-2">
            {demoUsers.map((user) => {
              const roleName = user.roles.map((r) => r.role).join(', ');
              const isTeacher = user.roles.some((r) =>
                ['SUPER_ADMIN', 'ADMIN', 'TEACHER'].includes(r.role)
              );

              return (
                <form key={user.id} action={signInDemoAction.bind(null, user.id)}>
                  <button
                    type="submit"
                    className="w-full text-left p-3 rounded-xl bg-white hover:bg-teal-100/50 border border-teal-200/60 hover:border-teal-300 transition-colors flex items-center justify-between group shadow-2xs"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-900 group-hover:text-teal-800">
                        {user.name}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {user.email} • <span className="font-semibold text-teal-700">{roleName}</span>
                      </p>
                    </div>
                    <span className="text-[11px] font-bold px-2 py-1 rounded-md bg-teal-100 text-teal-800 group-hover:bg-teal-800 group-hover:text-white transition-colors">
                      Enter →
                    </span>
                  </button>
                </form>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="shrink-0 mx-4 text-xs font-semibold text-slate-400 uppercase">
            Or Sign In With Email
          </span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        {/* Standard Email Sign-In / Register Form */}
        <form action={signInWithEmailAction} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Your Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Tanha Rahman"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-hidden"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="student@example.com"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-hidden"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Class / Grade Level
            </label>
            <select
              name="gradeLevel"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-hidden bg-white"
            >
              <option value="Class 6">Class 6</option>
              <option value="Class 7">Class 7</option>
              <option value="Class 8">Class 8</option>
              <option value="Class 9">Class 9</option>
              <option value="Class 10">Class 10</option>
              <option value="HSC">HSC / College</option>
              <option value="All Levels">All Levels / General</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-sm shadow-md transition-colors"
          >
            Continue to Dashboard
          </button>
        </form>

        <p className="text-[11px] text-center text-slate-400">
          🔒 Child-safe platform. We never share student details or display third-party advertisements.
        </p>

      </div>
    </div>
  );
}
