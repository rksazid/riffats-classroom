import Link from 'next/link';
import Image from 'next/image';
import { db } from '@/lib/db';
import {
  Sparkles,
  BookOpen,
  CheckCircle2,
  Clock,
  ArrowRight,
  GraduationCap,
  Award,
  Users,
  Compass,
  FileText,
  PlayCircle,
  HelpCircle,
  ChevronRight
} from 'lucide-react';
import { formatDuration } from '@/lib/utils';

export default async function HomePage() {
  // Query real data from database
  const [lessons, courses, topics, todayChallenge, notices] = await Promise.all([
    db.lesson.findMany({
      where: { isPublished: true },
      take: 4,
      orderBy: { publishedAt: 'desc' },
      include: {
        topic: true,
        teacher: { select: { name: true } },
      },
    }),
    db.course.findMany({
      where: { isPublished: true },
      take: 2,
      include: {
        modules: {
          include: {
            lessons: true,
          },
        },
        instructor: { select: { name: true } },
      },
    }),
    db.topic.findMany({
      take: 6,
      include: {
        _count: { select: { lessons: true } },
      },
      orderBy: { orderIndex: 'asc' },
    }),
    db.dailyChallengeInstance.findFirst({
      orderBy: { challengeDate: 'desc' },
      include: {
        quiz: {
          include: {
            questions: true,
            topic: true,
          },
        },
      },
    }),
    db.notice.findMany({
      where: { isPinned: true },
      take: 2,
      orderBy: { publishedAt: 'desc' },
    }),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-900 via-teal-800 to-slate-900 text-white py-16 md:py-24">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Headline and Call-to-actions */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-500/20 border border-pink-400/30 text-pink-300 text-xs sm:text-sm font-semibold tracking-wide">
                <Sparkles className="w-4 h-4 text-pink-400" />
                <span>Your Friendly Space to Learn English</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15]">
                Learn English. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-300 to-pink-200">
                  Build Confidence.
                </span> <br />
                Shine Brighter.
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                Welcome to Riffat&apos;s Classroom! Master English grammar, sentence building, articles, and question formation through warm video explanations, worksheets, and daily interactive challenges.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/daily-challenge"
                  className="px-6 py-3.5 rounded-xl font-bold text-base text-white bg-pink-600 hover:bg-pink-500 shadow-lg shadow-pink-600/30 hover:shadow-pink-600/50 transition-all flex items-center gap-2 group"
                >
                  <Sparkles className="w-5 h-5 text-pink-200 group-hover:rotate-12 transition-transform" />
                  <span>Try Today&apos;s Challenge</span>
                </Link>

                <Link
                  href="/lessons"
                  className="px-6 py-3.5 rounded-xl font-bold text-base text-white bg-slate-800/80 hover:bg-slate-700/90 border border-slate-700 transition-all flex items-center gap-2"
                >
                  <BookOpen className="w-5 h-5 text-teal-300" />
                  <span>Explore Lessons</span>
                </Link>
              </div>

              {/* Verified School Badge */}
              <div className="pt-4 flex items-center justify-center lg:justify-start gap-3 text-xs sm:text-sm text-slate-400 border-t border-slate-700/60">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>
                  Led by an experienced teacher formerly at Hajee Moajjem Ali High School, Demra, Dhaka
                </span>
              </div>
            </div>

            {/* Right Column: Interactive Today's Challenge Preview Widget */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200/80">
                <div className="absolute -top-4 -right-4 bg-pink-600 text-white text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Daily Habit</span>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800 shrink-0">
                    <Award className="w-7 h-7 text-pink-600" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                      Signature Feature
                    </span>
                    <h2 className="text-xl font-extrabold text-slate-900 leading-tight">
                      Today&apos;s Grammar Challenge
                    </h2>
                  </div>
                </div>

                {todayChallenge ? (
                  <div className="space-y-4">
                    <p className="text-sm text-slate-600 font-medium">
                      {todayChallenge.quiz.title}
                    </p>

                    <div className="grid grid-cols-2 gap-3 py-2 text-xs">
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <div>
                          <p className="text-slate-500 font-medium">Questions</p>
                          <p className="font-bold text-slate-800">
                            {todayChallenge.quiz.questions.length} Items
                          </p>
                        </div>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-teal-600" />
                        <div>
                          <p className="text-slate-500 font-medium">Time Limit</p>
                          <p className="font-bold text-slate-800">
                            {todayChallenge.quiz.durationMinutes || 10} Minutes
                          </p>
                        </div>
                      </div>
                    </div>

                    <Link
                      href={`/quizzes/${todayChallenge.quiz.slug}`}
                      className="w-full py-3 px-4 bg-teal-800 hover:bg-teal-900 text-white font-bold text-center rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
                    >
                      <span>Start Quiz Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3 py-2">
                    <p className="text-sm text-slate-600">
                      Practice daily English grammar questions to boost your vocabulary and sentence skills.
                    </p>
                    <Link
                      href="/daily-challenge"
                      className="w-full py-3 px-4 bg-teal-800 hover:bg-teal-900 text-white font-bold text-center rounded-xl transition-colors block"
                    >
                      Open Daily Challenge
                    </Link>
                  </div>
                )}
                
                <p className="text-[11px] text-center text-slate-400 mt-4">
                  ✨ No login required to test yourself! Sign in anytime to track your streaks.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. PINNED NOTICES BANNER (IF ANY) */}
      {notices.length > 0 && (
        <section className="bg-pink-50 border-b border-pink-200/80 py-3 px-4">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-2 text-pink-900 font-semibold">
              <span className="px-2 py-0.5 rounded bg-pink-600 text-white text-xs font-bold uppercase">
                Notice
              </span>
              <span>{notices[0].title}</span>
            </div>
            <Link
              href="/notices"
              className="text-xs font-bold text-pink-700 hover:text-pink-800 underline underline-offset-2 shrink-0"
            >
              View All Notices →
            </Link>
          </div>
        </section>
      )}

      {/* 3. FEATURED LEARNING CATEGORIES */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold tracking-wider uppercase text-pink-600">
                Structured Curriculum
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900">
                Explore English Topics
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Every topic is built around clear rules, real examples, and practical exercises.
              </p>
            </div>
            <Link
              href="/lessons"
              className="text-sm font-bold text-teal-800 hover:text-teal-900 flex items-center gap-1.5 self-start md:self-auto"
            >
              <span>View all lessons</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic) => (
              <Link
                key={topic.id}
                href={`/lessons?topic=${topic.slug}`}
                className="group bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs hover:border-pink-300 card-hover-lift flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-800 mb-4 group-hover:bg-pink-50 group-hover:text-pink-600 group-hover:border-pink-200 transition-colors">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 group-hover:text-pink-600 transition-colors mb-2">
                    {topic.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {topic._count.lessons} Published {topic._count.lessons === 1 ? 'Lesson' : 'Lessons'}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-teal-800 group-hover:text-pink-600">
                  <span>Start learning</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. LATEST LESSONS */}
      <section className="py-16 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold tracking-wider uppercase text-teal-700">
                Fresh Educational Content
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900">
                Latest Recorded Lessons
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Watch clear video lessons with downloadable worksheets and practice quizzes.
              </p>
            </div>
            <Link
              href="/lessons"
              className="text-sm font-bold text-teal-800 hover:text-teal-900 flex items-center gap-1.5 self-start md:self-auto"
            >
              <span>See full catalog</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {lessons.map((lesson) => (
              <div
                key={lesson.id}
                className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200/80 flex flex-col justify-between card-hover-lift group"
              >
                <div>
                  <div className="relative h-44 bg-teal-900 flex items-center justify-center overflow-hidden">
                    <Image
                      src={lesson.thumbnailUrl || '/images/logo.png'}
                      alt={lesson.title}
                      width={176}
                      height={176}
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

                  <div className="p-5">
                    <span className="text-xs font-bold text-pink-600 block mb-1">
                      {lesson.topic.name}
                    </span>
                    <h3 className="font-extrabold text-base text-slate-900 line-clamp-2 leading-snug mb-2 group-hover:text-teal-800 transition-colors">
                      {lesson.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {lesson.summary}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link
                    href={`/lessons/${lesson.slug}`}
                    className="w-full py-2.5 px-4 bg-white hover:bg-teal-50 text-teal-800 font-bold text-xs text-center rounded-xl border border-slate-200 hover:border-teal-300 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <PlayCircle className="w-4 h-4 text-pink-600" />
                    <span>Watch Lesson</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FEATURED COURSES & CERTIFICATES */}
      {courses.length > 0 && (
        <section className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold tracking-wider uppercase text-pink-600">
                Structured Learning Paths
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900">
                Recorded Foundation Courses
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Complete modules step-by-step, take final quizzes, and earn verifiable certificates.
              </p>
            </div>

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

                      <h3 className="text-2xl font-black text-slate-900 mb-3 leading-snug">
                        {course.title}
                      </h3>
                      
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

                    <div className="flex items-center gap-4">
                      <Link
                        href={`/courses/${course.slug}`}
                        className="flex-1 py-3 px-6 bg-teal-800 hover:bg-teal-900 text-white font-bold text-sm text-center rounded-xl transition-colors shadow-xs"
                      >
                        Enroll / View Syllabus
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 6. HOW IT WORKS */}
      <section className="py-16 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900">
              How Riffat&apos;s Classroom Works
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Four simple, motivating steps to build real English confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-200 text-teal-800 font-black text-xl flex items-center justify-center mx-auto shadow-xs">
                1
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Explore</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Browse our free grammar lessons or find topics relevant to your school class syllabus.
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-pink-50 border border-pink-200 text-pink-600 font-black text-xl flex items-center justify-center mx-auto shadow-xs">
                2
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Learn</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Watch bite-sized videos and read clear explanations with real sentence examples.
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-black text-xl flex items-center justify-center mx-auto shadow-xs">
                3
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Practice</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Take the daily grammar challenge, complete practice quizzes, and download worksheets.
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 font-black text-xl flex items-center justify-center mx-auto shadow-xs">
                4
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Grow</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Track your learning streak, review mistakes, and earn course completion certificates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. ABOUT THE TEACHER SECTION */}
      <section className="py-16 bg-slate-100/70 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative w-52 h-52 rounded-3xl overflow-hidden ring-4 ring-pink-500/20 shadow-md">
                <Image
                  src="/images/logo.png"
                  alt="Teacher Riffat Sultana"
                  width={208}
                  height={208}
                  className="object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-8 space-y-4">
              <div className="inline-block px-3 py-1 rounded-md bg-teal-50 text-teal-800 text-xs font-bold uppercase tracking-wider">
                Founder & Instructor
              </div>
              <h2 className="text-3xl font-black text-slate-900">
                Meet Teacher Riffat Sultana
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Having taught English at Hajee Moajjem Ali High School in Demra, Dhaka, Riffat Sultana founded Riffat&apos;s Classroom to make English grammar intuitive, approachable, and truly joyful for young learners across Bangladesh.
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                Her teaching methodology removes fear from grammar by breaking complex structures into bite-sized patterns, practical questions, and daily confidence-building exercises.
              </p>

              <div className="pt-2 flex flex-wrap gap-4">
                <Link
                  href="/about"
                  className="px-5 py-2.5 rounded-xl font-bold text-sm text-teal-900 bg-teal-50 hover:bg-teal-100 border border-teal-200 transition-colors"
                >
                  Read Teacher Story
                </Link>
                <a
                  href="https://www.youtube.com/@riffats.classroom/videos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl font-bold text-sm text-pink-700 bg-pink-50 hover:bg-pink-100 border border-pink-200 transition-colors flex items-center gap-2"
                >
                  <span>Visit YouTube Channel</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
