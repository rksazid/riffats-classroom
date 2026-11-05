import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { signInDemoAction, signInWithEmailAction } from '@/features/auth/actions';
import { Sparkles, GraduationCap, BookOpen, ShieldCheck, UserCheck, ArrowRight, Lock } from 'lucide-react';
import Image from 'next/image';

function getRoleBadge(roles: string[], gradeLevel?: string | null) {
  if (roles.includes('SUPER_ADMIN') || roles.includes('ADMIN')) {
    return {
      label: 'Lead Teacher & Admin',
      color: 'bg-purple-50 text-purple-700 border-purple-200',
      icon: ShieldCheck,
    };
  }
  if (roles.includes('TEACHER')) {
    return {
      label: 'English Teacher',
      color: 'bg-teal-50 text-teal-700 border-teal-200',
      icon: GraduationCap,
    };
  }
  if (roles.includes('GUARDIAN')) {
    return {
      label: 'Parent / Guardian',
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: UserCheck,
    };
  }
  return {
    label: gradeLevel ? `Student (${gradeLevel})` : 'Student',
    color: 'bg-pink-50 text-pink-700 border-pink-200',
    icon: BookOpen,
  };
}

export default async function SignInPage() {
  const currentUser = await getCurrentUser();
  if (currentUser) {
    if (currentUser.roles.some((r) => ['SUPER_ADMIN', 'ADMIN', 'TEACHER'].includes(r))) {
      redirect('/teacher/dashboard');
    } else {
      redirect('/student/dashboard');
    }
  }

  // Fetch demo users for convenient 1-click role testing
  const demoUsers = await db.user.findMany({
    include: { roles: true },
    orderBy: { createdAt: 'asc' },
  });

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center py-8 sm:py-12 px-3 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-lg w-full space-y-6 sm:space-y-8 bg-white p-4 sm:p-8 md:p-10 rounded-3xl border border-slate-200/90 shadow-xl">
        
        {/* Header */}
        <div className="text-center space-y-2 sm:space-y-3">
          <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden ring-4 ring-pink-500/20 shadow-md bg-teal-900 flex items-center justify-center">
            <Image
              src="/images/logo.png"
              alt="Riffat's Classroom Logo"
              width={64}
              height={64}
              className="object-cover w-full h-full"
              priority
            />
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            Welcome to Riffat&apos;s Classroom
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
            Sign in to access your student dashboard, save quiz progress, or manage lessons and curricula.
          </p>
        </div>

        {/* 1-Click Role Switcher (For Evaluation & Quick Access) */}
        <div className="bg-slate-50/90 p-3 sm:p-5 rounded-2xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-bold text-teal-800 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pink-600" />
              <span>1-Click Quick Demo Sign-In</span>
            </div>
            <span className="text-[10px] font-semibold text-slate-400">Review Access</span>
          </div>

          <div className="space-y-2">
            {demoUsers.map((user) => {
              const roleList = user.roles.map((r) => r.role);
              const badge = getRoleBadge(roleList, user.gradeLevel);
              const Icon = badge.icon;

              return (
                <form key={user.id} action={signInDemoAction.bind(null, user.id)}>
                  <button
                    type="submit"
                    className="w-full text-left p-2.5 sm:p-3 rounded-xl bg-white hover:bg-teal-50/60 border border-slate-200/80 hover:border-teal-300 transition-all flex items-center justify-between gap-2.5 sm:gap-3 group shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-teal-100/70 text-teal-900 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-teal-800" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap sm:flex-nowrap items-baseline sm:items-center gap-1 sm:gap-2">
                          <p className="text-xs font-bold text-slate-900 group-hover:text-teal-900 truncate">
                            {user.name}
                          </p>
                          <span
                            className={`text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full border ${badge.color} whitespace-nowrap shrink-0`}
                          >
                            {badge.label}
                          </span>
                        </div>
                        <p className="text-[10px] sm:text-[11px] text-slate-500 truncate mt-0.5">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] sm:text-[11px] font-bold px-2 sm:px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 group-hover:bg-teal-800 group-hover:text-white transition-colors shrink-0 whitespace-nowrap">
                      Sign In →
                    </span>
                  </button>
                </form>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="shrink-0 mx-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
            Or Sign In With Email
          </span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        {/* Standard Email Sign-In / Register Form */}
        <form action={signInWithEmailAction} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Tanha Rahman"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-hidden transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="student@example.com"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-hidden transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Class / Grade Level
            </label>
            <select
              name="gradeLevel"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-hidden bg-white transition-all"
            >
              <option value="Class 6">Class 6 (English Grammar Foundation)</option>
              <option value="Class 7">Class 7 (English Grammar &amp; Writing)</option>
              <option value="Class 8">Class 8 (JSC / Junior English)</option>
              <option value="Class 9">Class 9 (SSC English First &amp; Second Paper)</option>
              <option value="Class 10">Class 10 (SSC Examination Preparation)</option>
              <option value="HSC">HSC / College Level English</option>
              <option value="All Levels">General Learner / All Levels</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-sm shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>Continue to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 flex items-center justify-center gap-1.5 text-xs text-slate-400">
          <Lock className="w-3.5 h-3.5" />
          <span>Child-safe learning platform. Your personal information is protected.</span>
        </div>

      </div>
    </div>
  );
}
