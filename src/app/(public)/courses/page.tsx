import { db } from '@/lib/db';
import Link from 'next/link';
import Image from 'next/image';
import { GraduationCap, Award, BookOpen, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';

export default async function CoursesCatalogPage() {
  const courses = await db.course.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: 'desc' },
    include: {
      instructor: { select: { name: true } },
      modules: {
        include: {
          lessons: {
            include: { lesson: true },
          },
        },
      },
    },
  });

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 text-pink-700 text-xs font-bold uppercase tracking-wider">
            <GraduationCap className="w-4 h-4" />
            <span>Structured Recorded Paths</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            English Foundation Courses
          </h1>
          <p className="text-sm text-slate-600">
            Step-by-step video courses with curriculum modules, downloadable worksheets, quizzes, and verifiable completion certificates.
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {courses.map((course) => {
            const totalLessons = course.modules.reduce(
              (sum, m) => sum + m.lessons.length,
              0
            );

            return (
              <div
                key={course.id}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col justify-between card-hover-lift"
              >
                <div>
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <span className="px-3 py-1 bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold rounded-lg">
                      {course.gradeRange}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      Instructor: {course.instructor.name}
                    </span>
                  </div>

                  <h2 className="text-2xl font-black text-slate-900 mb-3 leading-snug">
                    {course.title}
                  </h2>
                  
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {course.description}
                  </p>

                  <div className="grid grid-cols-3 gap-3 mb-6 py-3 px-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                    <div>
                      <p className="text-xs text-slate-500">Modules</p>
                      <p className="text-base font-extrabold text-slate-900">
                        {course.modules.length}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Lessons</p>
                      <p className="text-base font-extrabold text-slate-900">
                        {totalLessons}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Certificate</p>
                      <p className="text-base font-extrabold text-pink-600">
                        Included
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                  <Link
                    href={`/courses/${course.slug}`}
                    className="flex-1 py-3 px-6 bg-teal-800 hover:bg-teal-900 text-white font-bold text-sm text-center rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2"
                  >
                    <span>View Curriculum & Enroll</span>
                    <ArrowRight className="w-4 h-4" />
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

