import { requireUser } from '@/features/auth/guards';
import { db } from '@/lib/db';
import Link from 'next/link';
import { BookOpen, PlayCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

export default async function StudentCoursesPage() {
  const user = await requireUser();

  const enrollments = await db.courseEnrollment.findMany({
    where: { userId: user.id },
    include: {
      course: {
        include: {
          instructor: { select: { name: true } },
          modules: {
            include: {
              lessons: {
                include: {
                  lesson: {
                    include: {
                      progressRecords: {
                        where: { userId: user.id },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm">
          <div>
            <span className="text-xs font-bold text-teal-800 uppercase tracking-wider block">
              Enrolled Curricula
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              My Learning Paths
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Continue your recorded courses and track your progress toward completion certificates.
            </p>
          </div>

          <Link
            href="/courses"
            className="px-5 py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors self-start sm:self-auto"
          >
            Browse All Courses
          </Link>
        </div>

        {/* Enrollments Grid */}
        {enrollments.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center space-y-4">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">
              You haven&apos;t enrolled in any courses yet
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Explore our structured foundation courses in sentence structure, articles, and grammar.
            </p>
            <Link
              href="/courses"
              className="inline-block px-5 py-2.5 bg-teal-800 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              Explore Courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {enrollments.map((e) => {
              const allLessons = e.course.modules.flatMap((m) => m.lessons);
              const completedCount = allLessons.filter(
                (l) => l.lesson.progressRecords?.[0]?.isCompleted
              ).length;
              const progressPct =
                allLessons.length > 0
                  ? Math.round((completedCount / allLessons.length) * 100)
                  : 0;

              return (
                <div
                  key={e.id}
                  className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col justify-between card-hover-lift space-y-6"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-md bg-teal-50 text-teal-800 text-[10px] font-extrabold uppercase">
                        {e.status}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">
                        {e.course.instructor.name}
                      </span>
                    </div>

                    <h2 className="text-xl font-black text-slate-900 leading-snug">
                      {e.course.title}
                    </h2>

                    <p className="text-xs text-slate-600 line-clamp-2">
                      {e.course.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="space-y-1.5 pt-2">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-600">Course Progress</span>
                        <span className="text-pink-600">{progressPct}%</span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-teal-700 to-pink-600 rounded-full transition-all duration-500"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {completedCount} of {allLessons.length} lessons finished
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                    <Link
                      href={`/student/courses/${e.course.slug}/learn`}
                      className="flex-1 py-3 px-4 bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs text-center rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                    >
                      <PlayCircle className="w-4 h-4" />
                      <span>Continue Player</span>
                    </Link>

                    <Link
                      href={`/courses/${e.course.slug}`}
                      className="px-4 py-3 border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition-colors"
                    >
                      Syllabus
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
