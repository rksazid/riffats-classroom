import { requireUser } from '@/features/auth/guards';
import { db } from '@/lib/db';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { getEmbedUrl } from '@/lib/video';
import { markLessonCompleteAction } from '@/features/lessons/actions';
import {
  BookOpen,
  CheckCircle2,
  PlayCircle,
  ChevronLeft,
  ChevronRight,
  Award,
  ArrowLeft,
  Download,
  FileText
} from 'lucide-react';
import { formatDuration } from '@/lib/utils';

interface CourseLearnProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lesson?: string }>;
}

export default async function StudentCoursePlayerPage({
  params,
  searchParams,
}: CourseLearnProps) {
  const user = await requireUser();
  const { slug } = await params;
  const { lesson: lessonIdParam } = await searchParams;

  const course = await db.course.findUnique({
    where: { slug },
    include: {
      instructor: { select: { name: true } },
      modules: {
        orderBy: { orderIndex: 'asc' },
        include: {
          lessons: {
            orderBy: { orderIndex: 'asc' },
            include: {
              lesson: {
                include: {
                  assets: true,
                  progressRecords: {
                    where: { userId: user.id },
                  },
                },
              },
            },
          },
        },
      },
      enrollments: {
        where: { userId: user.id },
      },
    },
  });

  if (!course || course.enrollments.length === 0) {
    redirect(`/courses/${slug}`);
  }

  // Flatten all lessons in order
  const allLessons = course.modules.flatMap((m) => m.lessons);

  // Active lesson: selected by URL param or first incomplete lesson
  let activeCourseLesson = lessonIdParam
    ? allLessons.find((l) => l.lessonId === lessonIdParam)
    : allLessons.find((l) => !l.lesson.progressRecords?.[0]?.isCompleted) || allLessons[0];

  if (!activeCourseLesson && allLessons.length > 0) {
    activeCourseLesson = allLessons[0];
  }

  if (!activeCourseLesson) {
    notFound();
  }

  const activeLesson = activeCourseLesson.lesson;
  const isCompleted = activeLesson.progressRecords?.[0]?.isCompleted || false;
  const embedUrl = activeLesson.videoUrl
    ? getEmbedUrl(activeLesson.videoUrl, activeLesson.videoProvider)
    : '';

  // Determine prev and next
  const currentIdx = allLessons.findIndex((l) => l.id === activeCourseLesson.id);
  const prevLesson = currentIdx > 0 ? allLessons[currentIdx - 1] : null;
  const nextLesson = currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1] : null;

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      
      {/* Top Bar */}
      <header className="h-16 bg-slate-950 border-b border-slate-800 px-4 sm:px-8 flex items-center justify-between z-30">
        <div className="flex items-center gap-3">
          <Link
            href="/student/courses"
            className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Back to my courses"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="truncate max-w-xs sm:max-w-md">
            <span className="text-[10px] font-bold uppercase text-teal-400 tracking-wider block">
              {course.title}
            </span>
            <h1 className="text-sm font-extrabold text-white truncate">
              {activeLesson.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {course.certificateEnabled && (
            <Link
              href="/student/certificates"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-500/20 text-pink-300 text-xs font-bold border border-pink-500/30"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Certificate</span>
            </Link>
          )}
        </div>
      </header>

      {/* Main Layout: Video/Content Area + Curriculum Sidebar */}
      <div className="flex-1 flex flex-col lg:flex-row">
        
        {/* Left/Center: Video & Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">
          
          {/* Video Player */}
          {embedUrl ? (
            <div className="bg-black rounded-3xl overflow-hidden aspect-video shadow-2xl border border-slate-800">
              <iframe
                src={embedUrl}
                title={activeLesson.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="bg-slate-800 rounded-3xl p-12 text-center text-slate-400">
              <PlayCircle className="w-12 h-12 mx-auto mb-2 text-slate-500" />
              <p className="text-sm">No video attached to this lesson.</p>
            </div>
          )}

          {/* Action Row: Mark Complete + Next/Prev */}
          <div className="bg-slate-800/80 p-4 sm:p-6 rounded-2xl border border-slate-700/80 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <form action={markLessonCompleteAction.bind(null, activeLesson.id)}>
                <button
                  type="submit"
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    isCompleted
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-pink-600 hover:bg-pink-500 text-white shadow-md'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isCompleted ? 'Lesson Completed ✓' : 'Mark as Completed'}</span>
                </button>
              </form>
            </div>

            <div className="flex items-center gap-2">
              {prevLesson && (
                <Link
                  href={`/student/courses/${course.slug}/learn?lesson=${prevLesson.lessonId}`}
                  className="px-3.5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-xs font-bold text-white transition-colors flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Prev</span>
                </Link>
              )}
              {nextLesson && (
                <Link
                  href={`/student/courses/${course.slug}/learn?lesson=${nextLesson.lessonId}`}
                  className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-600 text-xs font-bold text-white transition-colors flex items-center gap-1"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>

          {/* Written Study Notes */}
          <div className="bg-slate-800/60 p-6 sm:p-8 rounded-3xl border border-slate-700/80 space-y-4">
            <h2 className="text-lg font-bold text-teal-300">
              Lesson Study Notes
            </h2>
            <div
              className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: activeLesson.content }}
            />
          </div>

          {/* Assets & Worksheets */}
          {activeLesson.assets.length > 0 && (
            <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/80 space-y-3">
              <h3 className="text-sm font-bold text-pink-400 flex items-center gap-2">
                <Download className="w-4 h-4" />
                <span>Downloadable Worksheets</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeLesson.assets.map((asset) => (
                  <a
                    key={asset.id}
                    href={asset.fileUrl}
                    download
                    className="p-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-pink-500 transition-colors flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-teal-400" />
                      <span className="font-semibold text-white">{asset.title}</span>
                    </div>
                    <Download className="w-3.5 h-3.5 text-slate-400" />
                  </a>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Sidebar: Course Curriculum Navigation */}
        <aside className="w-full lg:w-80 bg-slate-950 border-t lg:border-t-0 lg:border-l border-slate-800 p-4 sm:p-6 overflow-y-auto space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Curriculum Lessons
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              {allLessons.filter((l) => l.lesson.progressRecords?.[0]?.isCompleted).length} / {allLessons.length} Completed
            </p>
          </div>

          <div className="space-y-4">
            {course.modules.map((m, mIdx) => (
              <div key={m.id} className="space-y-2">
                <span className="text-[11px] font-bold text-pink-400 uppercase tracking-wide">
                  {m.title}
                </span>

                <div className="space-y-1">
                  {m.lessons.map((cl) => {
                    const isCLDone = cl.lesson.progressRecords?.[0]?.isCompleted || false;
                    const isCLActive = cl.lessonId === activeLesson.id;

                    return (
                      <Link
                        key={cl.id}
                        href={`/student/courses/${course.slug}/learn?lesson=${cl.lessonId}`}
                        className={`p-2.5 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                          isCLActive
                            ? 'bg-teal-800 text-white font-bold'
                            : 'hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          {isCLDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <PlayCircle className="w-4 h-4 text-slate-500 shrink-0" />
                          )}
                          <span className="truncate">{cl.lesson.title}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 shrink-0 ml-2">
                          {formatDuration(cl.lesson.durationMinutes)}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

      </div>
    </div>
  );
}
