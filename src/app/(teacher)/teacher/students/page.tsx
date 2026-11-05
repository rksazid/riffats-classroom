import { requireTeacher } from '@/features/auth/guards';
import { db } from '@/lib/db';
import Link from 'next/link';
import { Users, GraduationCap, Sparkles, Award } from 'lucide-react';
import { formatDhakaDateOnly } from '@/lib/timezone';

export default async function TeacherStudentsPage() {
  await requireTeacher();

  const students = await db.user.findMany({
    where: {
      roles: {
        some: { role: 'STUDENT' },
      },
    },
    include: {
      streak: true,
      courseEnrollments: {
        include: { course: true },
      },
      quizAttempts: {
        take: 3,
        orderBy: { startedAt: 'desc' },
      },
    },
  });

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm">
          <div>
            <span className="text-xs font-bold text-teal-800 uppercase tracking-wider block">
              Learner Management
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Enrolled Students ({students.length})
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Monitor student engagement, learning streaks, and assessment results.
            </p>
          </div>
        </div>

        {/* Student Roster Table */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="divide-y divide-slate-100">
            {students.map((st) => (
              <div
                key={st.id}
                className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800 font-extrabold text-sm shrink-0">
                    {st.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      {st.name} {st.bengaliName && <span className="text-xs font-normal text-slate-500">({st.bengaliName})</span>}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {st.email} • <span className="font-semibold text-teal-800">{st.gradeLevel || 'Class 8'}</span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs">
                  <div className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/80">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Streak</span>
                    <span className="font-extrabold text-pink-600">
                      {st.streak?.currentStreak || 0} Days 🔥
                    </span>
                  </div>

                  <div className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/80">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Challenges</span>
                    <span className="font-extrabold text-teal-800">
                      {st.streak?.totalChallengesCompleted || 0} Done
                    </span>
                  </div>

                  <div className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/80">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Courses</span>
                    <span className="font-extrabold text-slate-800">
                      {st.courseEnrollments.length} Active
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
