import { requireTeacher } from '@/features/auth/guards';
import { db } from '@/lib/db';
import Link from 'next/link';
import {
  BookOpen,
  PlusCircle,
  HelpCircle,
  GraduationCap,
  Sparkles,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  Settings,
  Layers,
  Award
} from 'lucide-react';
import { formatDhakaDateOnly } from '@/lib/timezone';

export default async function TeacherDashboardPage() {
  const teacher = await requireTeacher();

  // Query platform and instructor metrics
  const [
    lessonsCount,
    coursesCount,
    questionsCount,
    quizzesCount,
    recentAttempts,
    recentLessons,
  ] = await Promise.all([
    db.lesson.count(),
    db.course.count(),
    db.question.count(),
    db.quiz.count(),
    db.quizAttempt.findMany({
      take: 6,
      orderBy: { startedAt: 'desc' },
      include: {
        quiz: true,
        user: { select: { name: true, gradeLevel: true } },
      },
    }),
    db.lesson.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        topic: true,
      },
    }),
  ]);

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2">
              <span>Teacher & Instructor Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Welcome, {teacher.name}! 🎓
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Manage your grammar lessons, courses, question bank, assessments, and review student progress.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/teacher/lessons/new"
              className="px-4 py-2.5 bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Lesson</span>
            </Link>
            <Link
              href="/teacher/question-bank"
              className="px-4 py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Question Bank</span>
            </Link>
          </div>
        </div>

        {/* 1. Overview Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase">Published Lessons</span>
              <BookOpen className="w-5 h-5 text-teal-700" />
            </div>
            <p className="text-3xl font-black text-slate-900">{lessonsCount}</p>
            <p className="text-[11px] text-teal-700 font-semibold mt-1">
              Active in catalog
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase">Structured Courses</span>
              <GraduationCap className="w-5 h-5 text-pink-600" />
            </div>
            <p className="text-3xl font-black text-slate-900">{coursesCount}</p>
            <p className="text-[11px] text-pink-600 font-semibold mt-1">
              Recorded curricula
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase">Question Bank</span>
              <HelpCircle className="w-5 h-5 text-sky-600" />
            </div>
            <p className="text-3xl font-black text-slate-900">{questionsCount}</p>
            <p className="text-[11px] text-sky-600 font-semibold mt-1">
              10 question types
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase">Quizzes & Exams</span>
              <Award className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-3xl font-black text-slate-900">{quizzesCount}</p>
            <p className="text-[11px] text-amber-600 font-semibold mt-1">
              Timed & daily challenges
            </p>
          </div>
        </div>

        {/* 2. Management Navigation Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            href="/teacher/lessons"
            className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-teal-300 card-hover-lift block"
          >
            <Layers className="w-6 h-6 text-teal-800 mb-2" />
            <p className="text-sm font-bold text-slate-900">Manage Lessons</p>
            <p className="text-[11px] text-slate-500">Edit content & videos</p>
          </Link>

          <Link
            href="/teacher/courses"
            className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-pink-300 card-hover-lift block"
          >
            <GraduationCap className="w-6 h-6 text-pink-600 mb-2" />
            <p className="text-sm font-bold text-slate-900">Course Curriculum</p>
            <p className="text-[11px] text-slate-500">Modules & prerequisites</p>
          </Link>

          <Link
            href="/teacher/question-bank"
            className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-sky-300 card-hover-lift block"
          >
            <HelpCircle className="w-6 h-6 text-sky-600 mb-2" />
            <p className="text-sm font-bold text-slate-900">Question Bank</p>
            <p className="text-[11px] text-slate-500">10 assessment formats</p>
          </Link>

          <Link
            href="/admin/daily-challenge"
            className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-amber-300 card-hover-lift block"
          >
            <Sparkles className="w-6 h-6 text-amber-600 mb-2" />
            <p className="text-sm font-bold text-slate-900">Daily Challenges</p>
            <p className="text-[11px] text-slate-500">Weekly topic schedules</p>
          </Link>
        </div>

        {/* 3. Main Data Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Recent Submissions / Grading Queue */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Recent Student Assessment Attempts
                </h3>
                <p className="text-xs text-slate-500">
                  Real-time exam and quiz activity across your courses.
                </p>
              </div>
            </div>

            {recentAttempts.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                No quiz attempts submitted yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentAttempts.map((attempt) => (
                  <div key={attempt.id} className="py-3.5 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {attempt.user?.name || attempt.guestNickname || 'Guest Learner'}
                      </p>
                      <p className="text-xs text-slate-500">
                        Quiz: <span className="font-semibold">{attempt.quiz.title}</span> •{' '}
                        {formatDhakaDateOnly(attempt.startedAt)}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                          attempt.isPassed
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {attempt.percentage.toFixed(0)}% • {attempt.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Recent Lessons */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Recently Created Lessons
                </h3>
                <p className="text-xs text-slate-500">
                  Quick status & preview
                </p>
              </div>
              <Link
                href="/teacher/lessons/new"
                className="text-xs font-bold text-pink-600 hover:text-pink-700"
              >
                + New
              </Link>
            </div>

            <div className="space-y-3">
              {recentLessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between"
                >
                  <div className="max-w-[240px]">
                    <span className="text-[10px] font-bold text-pink-600 uppercase">
                      {lesson.topic.name}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {lesson.title}
                    </h4>
                  </div>
                  <Link
                    href={`/lessons/${lesson.slug}`}
                    className="text-xs font-semibold text-teal-800 hover:text-teal-900 underline"
                  >
                    View →
                  </Link>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

