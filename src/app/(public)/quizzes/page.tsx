import { db } from '@/lib/db';
import Link from 'next/link';
import { Award, Clock, HelpCircle, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export default async function QuizzesCatalogPage() {
  const quizzes = await db.quiz.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: 'desc' },
    include: {
      topic: true,
      questions: true,
      author: { select: { name: true } },
    },
  });

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 text-pink-700 text-xs font-bold uppercase tracking-wider">
            <Award className="w-4 h-4" />
            <span>Interactive Assessment Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Quizzes, Challenges & Practice Exams
          </h1>
          <p className="text-sm text-slate-600">
            Test your English grammar knowledge with timed and untimed quizzes. Free guest participation or sign in to track your learning streak!
          </p>
        </div>

        {/* Quizzes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => {
            const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);

            return (
              <div
                key={quiz.id}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs flex flex-col justify-between card-hover-lift"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-bold text-pink-600 uppercase tracking-wide">
                      {quiz.topic?.name || 'General English'}
                    </span>
                    {quiz.isDailyChallenge && (
                      <span className="px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 text-[10px] font-extrabold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Daily Challenge
                      </span>
                    )}
                  </div>

                  <h2 className="text-xl font-extrabold text-slate-900 leading-snug mb-2">
                    {quiz.title}
                  </h2>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-6">
                    {quiz.description}
                  </p>

                  <div className="grid grid-cols-2 gap-3 py-3 px-4 bg-slate-50 rounded-2xl border border-slate-100 mb-6 text-xs">
                    <div>
                      <p className="text-slate-400">Questions</p>
                      <p className="font-bold text-slate-800">{quiz.questions.length} Items</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Duration</p>
                      <p className="font-bold text-slate-800">
                        {quiz.durationMinutes ? `${quiz.durationMinutes} Mins` : 'Untimed'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <Link
                    href={`/quizzes/${quiz.slug}`}
                    className="w-full py-3 px-4 bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs text-center rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2"
                  >
                    <span>Start Assessment</span>
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

