import { db } from '@/lib/db';
import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Clock, PlayCircle, Filter, Sparkles, ChevronRight } from 'lucide-react';
import { formatDuration } from '@/lib/utils';

interface LessonsPageProps {
  searchParams: Promise<{ topic?: string; difficulty?: string; q?: string }>;
}

export default async function LessonsPage({ searchParams }: LessonsPageProps) {
  const { topic, difficulty, q } = await searchParams;

  const whereClause: any = {
    isPublished: true,
  };

  if (topic) {
    whereClause.topic = { slug: topic };
  }

  if (difficulty) {
    whereClause.difficulty = difficulty;
  }

  if (q) {
    whereClause.OR = [
      { title: { contains: q, mode: 'insensitive' } },
      { summary: { contains: q, mode: 'insensitive' } },
    ];
  }

  const [lessons, topics] = await Promise.all([
    db.lesson.findMany({
      where: whereClause,
      orderBy: { publishedAt: 'desc' },
      include: {
        topic: true,
        teacher: { select: { name: true } },
      },
    }),
    db.topic.findMany({
      orderBy: { orderIndex: 'asc' },
      include: {
        _count: { select: { lessons: true } },
      },
    }),
  ]);

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Educational Video Lessons</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Grammar Lessons & Video Guides
          </h1>
          <p className="text-sm text-slate-600">
            Learn English concepts clearly through teacher-led video lessons, written summaries, and downloadable practice worksheets.
          </p>
        </div>

        {/* Filter Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 pt-2">
          <Link
            href="/lessons"
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-colors whitespace-nowrap ${
              !topic
                ? 'bg-teal-800 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Topics ({topics.reduce((acc, t) => acc + t._count.lessons, 0)})
          </Link>

          {topics.map((t) => (
            <Link
              key={t.id}
              href={`/lessons?topic=${t.slug}`}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-colors whitespace-nowrap ${
                topic === t.slug
                  ? 'bg-teal-800 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {t.name} ({t._count.lessons})
            </Link>
          ))}
        </div>

        {/* Lessons Grid */}
        {lessons.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No lessons found</h3>
            <p className="text-xs text-slate-500 mt-1">
              Try selecting another topic filter above.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((lesson) => (
              <div
                key={lesson.id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-xs flex flex-col justify-between card-hover-lift group"
              >
                <div>
                  <div className="relative h-48 bg-teal-900 flex items-center justify-center overflow-hidden">
                    <Image
                      src={lesson.thumbnailUrl || '/images/logo.png'}
                      alt={lesson.title}
                      width={192}
                      height={192}
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-md">
                      {lesson.gradeLevel}
                    </div>
                    <div className="absolute bottom-3 right-3 bg-pink-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatDuration(lesson.durationMinutes)}</span>
                    </div>
                  </div>

                  <div className="p-6">
                    <span className="text-xs font-bold text-pink-600 block mb-1">
                      {lesson.topic.name}
                    </span>
                    <h3 className="font-extrabold text-base text-slate-900 line-clamp-2 leading-snug mb-2 group-hover:text-teal-800 transition-colors">
                      {lesson.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {lesson.summary}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Link
                    href={`/lessons/${lesson.slug}`}
                    className="w-full py-2.5 px-4 bg-teal-50 hover:bg-teal-800 text-teal-800 hover:text-white font-bold text-xs text-center rounded-xl border border-teal-200 hover:border-teal-800 transition-all flex items-center justify-center gap-1.5"
                  >
                    <PlayCircle className="w-4 h-4 text-pink-600" />
                    <span>Watch & Learn</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

