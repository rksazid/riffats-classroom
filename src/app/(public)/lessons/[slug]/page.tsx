import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getEmbedUrl } from '@/lib/video';
import { markLessonCompleteAction } from '@/features/lessons/actions';
import {
  BookOpen,
  Clock,
  CheckCircle2,
  Download,
  FileText,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Award
} from 'lucide-react';
import { formatDuration } from '@/lib/utils';

interface LessonSlugProps {
  params: Promise<{ slug: string }>;
}

export default async function LessonDetailPage({ params }: LessonSlugProps) {
  const { slug } = await params;
  const user = await getCurrentUser();

  const lesson = await db.lesson.findUnique({
    where: { slug },
    include: {
      topic: {
        include: { subject: true },
      },
      teacher: { select: { name: true, gradeLevel: true } },
      assets: true,
      practiceQuizzes: {
        where: { isPublished: true },
        take: 2,
      },
      progressRecords: user
        ? {
            where: { userId: user.id },
          }
        : false,
    },
  });

  if (!lesson || !lesson.isPublished) {
    notFound();
  }

  const isCompleted = user ? lesson.progressRecords?.[0]?.isCompleted : false;
  const embedUrl = lesson.videoUrl
    ? getEmbedUrl(lesson.videoUrl, lesson.videoProvider)
    : '';

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link href="/lessons" className="hover:text-teal-800 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Lessons</span>
          </Link>
          <span>/</span>
          <span className="text-pink-600">{lesson.topic.name}</span>
          <span>/</span>
          <span className="text-slate-800 truncate max-w-[200px]">{lesson.title}</span>
        </div>

        {/* Lesson Title & Metadata Header */}
        <div className="space-y-3 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-md bg-pink-50 text-pink-700 text-xs font-bold">
              {lesson.topic.name}
            </span>
            <span className="px-3 py-1 rounded-md bg-teal-50 text-teal-800 text-xs font-bold">
              {lesson.gradeLevel}
            </span>
            <span className="px-3 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatDuration(lesson.durationMinutes)}</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight">
            {lesson.title}
          </h1>

          <p className="text-sm text-slate-600 leading-relaxed">
            {lesson.summary}
          </p>

          <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
            <span>Instructor: <strong className="text-slate-800">{lesson.teacher.name}</strong></span>
            
            {user && (
              <form action={markLessonCompleteAction.bind(null, lesson.id)}>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isCompleted
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-teal-800 hover:bg-teal-900 text-white shadow-xs'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isCompleted ? 'Completed ✓' : 'Mark as Completed'}</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Video Player */}
        {embedUrl && (
          <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 aspect-video relative">
            <iframe
              src={embedUrl}
              title={lesson.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        {/* Written Lesson Notes */}
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">
            Lesson Notes & Study Guide
          </h2>
          <div
            className="prose prose-slate max-w-none prose-headings:font-extrabold prose-p:text-slate-700 prose-p:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: lesson.content }}
          />
        </div>

        {/* Downloadable Assets / Worksheets */}
        {lesson.assets.length > 0 && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Download className="w-5 h-5 text-pink-600" />
              <span>Downloadable Worksheets & Study Materials</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {lesson.assets.map((asset) => (
                <a
                  key={asset.id}
                  href={asset.fileUrl}
                  download
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-pink-300 card-hover-lift flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-teal-700" />
                    <div>
                      <p className="text-xs font-bold text-slate-900 group-hover:text-pink-600">
                        {asset.title}
                      </p>
                      <p className="text-[11px] text-slate-400 uppercase">
                        {asset.assetType}
                      </p>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-slate-400 group-hover:text-pink-600" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Practice Exercises & Next Steps */}
        <div className="bg-gradient-to-r from-teal-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-pink-400">
              Reinforce Your Learning
            </span>
            <h3 className="text-xl font-bold">
              Ready to test your understanding?
            </h3>
            <p className="text-xs text-slate-300">
              Take the quick practice quiz to solidify today&apos;s lesson rules.
            </p>
          </div>

          <Link
            href="/daily-challenge"
            className="px-6 py-3 bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs rounded-xl shadow-lg transition-colors shrink-0 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Practice Today&apos;s Challenge</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
