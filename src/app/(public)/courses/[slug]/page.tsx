import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { enrollInCourseAction } from '@/features/courses/actions';
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  Clock,
  Award,
  PlayCircle,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { formatDuration } from '@/lib/utils';

interface CourseSlugProps {
  params: Promise<{ slug: string }>;
}

export default async function CourseDetailPage({ params }: CourseSlugProps) {
  const { slug } = await params;
  const user = await getCurrentUser();

  const course = await db.course.findUnique({
    where: { slug },
    include: {
      instructor: { select: { name: true, gradeLevel: true } },
      modules: {
        orderBy: { orderIndex: 'asc' },
        include: {
          lessons: {
            orderBy: { orderIndex: 'asc' },
            include: {
              lesson: {
                include: {
                  progressRecords: user
                    ? {
                        where: { userId: user.id },
                      }
                    : false,
                },
              },
            },
          },
        },
      },
      enrollments: user
        ? {
            where: { userId: user.id },
          }
        : false,
    },
  });

  if (!course || !course.isPublished) {
    notFound();
  }

  const isEnrolled = user ? course.enrollments.length > 0 : false;
  const totalLessons = course.modules.reduce(
    (sum, m) => sum + m.lessons.length,
    0
  );

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Course Header Banner */}
        <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 bg-pink-500/20 text-pink-300 text-xs font-bold rounded-full">
              {course.gradeRange}
            </span>
            <span className="px-3 py-1 bg-teal-500/20 text-teal-200 text-xs font-bold rounded-full">
              {course.difficulty}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black leading-tight">
            {course.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            {course.description}
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-slate-700/60">
            <div className="text-xs text-slate-300">
              Lead Instructor: <strong className="text-white">{course.instructor.name}</strong>
            </div>

            {isEnrolled ? (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>You are Enrolled!</span>
              </div>
            ) : (
              <form action={enrollInCourseAction.bind(null, course.id, course.slug)}>
                <button
                  type="submit"
                  className="px-6 py-3 bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs rounded-xl shadow-lg transition-colors flex items-center gap-2"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Enroll in Course</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Curriculum Modules */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Course Curriculum
              </h2>
              <p className="text-xs text-slate-500">
                {course.modules.length} Modules • {totalLessons} Lessons
              </p>
            </div>
            {course.certificateEnabled && (
              <div className="flex items-center gap-1.5 text-xs font-bold text-pink-600 bg-pink-50 px-3 py-1.5 rounded-lg border border-pink-200">
                <Award className="w-4 h-4" />
                <span>Verifiable Certificate</span>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {course.modules.map((module, mIdx) => (
              <div
                key={module.id}
                className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50/60"
              >
                <div className="p-4 bg-slate-100/80 border-b border-slate-200 flex items-center justify-between">
                  <h3 className="font-extrabold text-sm text-slate-900">
                    {module.title}
                  </h3>
                  <span className="text-xs font-semibold text-slate-500">
                    {module.lessons.length} {module.lessons.length === 1 ? 'Lesson' : 'Lessons'}
                  </span>
                </div>

                <div className="divide-y divide-slate-200/70">
                  {module.lessons.map((cl, lIdx) => {
                    const isLessonDone =
                      cl.lesson.progressRecords?.[0]?.isCompleted || false;

                    return (
                      <div
                        key={cl.id}
                        className="p-4 bg-white flex items-center justify-between hover:bg-teal-50/40 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {isLessonDone ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                          ) : (
                            <PlayCircle className="w-5 h-5 text-slate-400 shrink-0" />
                          )}
                          <div>
                            <p className="text-xs font-bold text-slate-900">
                              {cl.lesson.title}
                            </p>
                            <p className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                              <span>Duration: {formatDuration(cl.lesson.durationMinutes)}</span>
                              {cl.isMandatory && (
                                <span className="text-amber-600 font-semibold">• Required for Certificate</span>
                              )}
                            </p>
                          </div>
                        </div>

                        <Link
                          href={`/lessons/${cl.lesson.slug}`}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-teal-800 hover:text-white text-slate-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                        >
                          <span>Open</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

