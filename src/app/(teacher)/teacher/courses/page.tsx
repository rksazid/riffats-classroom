import { requireTeacher } from '@/features/auth/guards';
import { db } from '@/lib/db';
import Link from 'next/link';
import { GraduationCap, PlusCircle, BookOpen, Users, Award, ArrowRight } from 'lucide-react';

export default async function TeacherCoursesPage() {
  await requireTeacher();

  const courses = await db.course.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      modules: {
        include: { lessons: true },
      },
      _count: { select: { enrollments: true } },
    },
  });

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm">
          <div>
            <span className="text-xs font-bold text-teal-800 uppercase tracking-wider block">
              Curriculum Management
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Course Curricula
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Manage structured courses, modules, lesson sequencing, and certificates.
            </p>
          </div>

          <Link
            href="/courses"
            className="px-5 py-2.5 bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors self-start sm:self-auto"
          >
            View Public Catalog
          </Link>
        </div>

        {/* Courses List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course) => {
            const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);

            return (
              <div
                key={course.id}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col justify-between card-hover-lift space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md bg-teal-50 text-teal-800 text-[10px] font-extrabold uppercase">
                      {course.gradeRange}
                    </span>
                    <span className="text-xs font-bold text-pink-600">
                      {course.difficulty}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-slate-900 leading-snug">
                    {course.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="grid grid-cols-3 gap-2 py-3 px-4 bg-slate-50 rounded-2xl border border-slate-100 text-center text-xs">
                    <div>
                      <p className="text-slate-400">Modules</p>
                      <p className="font-bold text-slate-900">{course.modules.length}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Lessons</p>
                      <p className="font-bold text-slate-900">{totalLessons}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Students</p>
                      <p className="font-bold text-teal-800">{course._count.enrollments}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <Link
                    href={`/courses/${course.slug}`}
                    className="flex-1 py-2.5 bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs text-center rounded-xl shadow-xs transition-colors"
                  >
                    View Curriculum
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
