import { requireTeacher } from '@/features/auth/guards';
import { db } from '@/lib/db';
import Link from 'next/link';
import { PlusCircle, BookOpen, Clock, PlayCircle, Eye, ArrowRight } from 'lucide-react';
import { formatDuration } from '@/lib/utils';
import { formatDhakaDateOnly } from '@/lib/timezone';

export default async function TeacherLessonsListPage() {
  const teacher = await requireTeacher();

  const lessons = await db.lesson.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      topic: true,
      teacher: { select: { name: true } },
    },
  });

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm">
          <div>
            <span className="text-xs font-bold text-teal-800 uppercase tracking-wider block">
              Content Management System
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              All Educational Lessons
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Create, edit, and organize recorded grammar lessons and worksheets.
            </p>
          </div>

          <Link
            href="/teacher/lessons/new"
            className="px-5 py-2.5 bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Lesson</span>
          </Link>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="divide-y divide-slate-100">
            {lessons.map((lesson) => (
              <div
                key={lesson.id}
                className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-pink-50 text-pink-700">
                      {lesson.topic.name}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        lesson.isPublished
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {lesson.isPublished ? 'Published' : 'Draft'}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {lesson.gradeLevel} • {formatDuration(lesson.durationMinutes)}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900">
                    {lesson.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-1">
                    {lesson.summary}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Link
                    href={`/lessons/${lesson.slug}`}
                    className="px-3.5 py-1.5 border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Public</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

