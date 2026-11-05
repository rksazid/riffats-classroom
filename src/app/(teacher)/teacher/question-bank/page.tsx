import { requireTeacher } from '@/features/auth/guards';
import { db } from '@/lib/db';
import Link from 'next/link';
import { HelpCircle, PlusCircle, Filter, CheckCircle2, Tag } from 'lucide-react';

export default async function TeacherQuestionBankPage() {
  await requireTeacher();

  const [questions, topics] = await Promise.all([
    db.question.findMany({
      where: { isArchived: false },
      orderBy: { createdAt: 'desc' },
      include: {
        topic: true,
        options: { orderBy: { orderIndex: 'asc' } },
        author: { select: { name: true } },
      },
    }),
    db.topic.findMany({ orderBy: { orderIndex: 'asc' } }),
  ]);

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm">
          <div>
            <span className="text-[10px] sm:text-xs font-bold text-pink-600 uppercase tracking-wider block">
              Assessment Repository
            </span>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 mt-0.5 sm:mt-1">
              Central Question Bank ({questions.length})
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Manage questions across 10 assessment types for practice quizzes, exams, and daily challenges.
            </p>
          </div>

          <Link
            href="/teacher/question-bank/new"
            className="px-4 sm:px-5 py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 self-start sm:self-auto shrink-0 whitespace-nowrap"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Question</span>
          </Link>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {questions.map((q, idx) => (
            <div
              key={q.id}
              className="bg-white rounded-3xl p-4 sm:p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-3.5 sm:space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 border-b border-slate-100 pb-2.5">
                <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 min-w-0">
                  <span className="text-[11px] font-black text-slate-400 shrink-0 mr-0.5">
                    #{idx + 1}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-pink-50 text-pink-700 text-[9px] sm:text-[10px] font-bold tracking-tight uppercase whitespace-nowrap shrink-0">
                    {q.topic.name}
                  </span>
                  <span className="px-1.5 sm:px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 text-[9px] sm:text-[10px] font-bold tracking-tight uppercase whitespace-nowrap shrink-0">
                    {q.type.replace('_', ' ')}
                  </span>
                  <span className="px-1.5 sm:px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[9px] sm:text-[10px] font-bold whitespace-nowrap shrink-0">
                    {q.gradeLevel}
                  </span>
                </div>

                <span className="text-[10px] sm:text-xs font-bold text-slate-500 whitespace-nowrap shrink-0 ml-auto sm:ml-0">
                  {q.points} {q.points === 1 ? 'Point' : 'Points'}
                </span>
              </div>

              <p className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                {q.questionText}
              </p>

              {/* Options Preview */}
              {q.options.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {q.options.map((opt) => (
                    <div
                      key={opt.id}
                      className={`p-3 rounded-xl border flex items-center gap-2.5 ${
                        opt.isCorrect
                          ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <span className="w-5 h-5 rounded-md bg-white text-slate-900 text-center font-black flex items-center justify-center border shadow-2xs">
                        {opt.optionKey}
                      </span>
                      <span>{opt.optionText}</span>
                      {opt.isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 ml-auto shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Explanation */}
              {q.explanation && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                  <strong className="text-slate-900">Explanation: </strong>
                  {q.explanation}
                </div>
              )}

              {/* Tags */}
              {q.tags.length > 0 && (
                <div className="flex items-center gap-1.5 pt-2">
                  <Tag className="w-3 h-3 text-slate-400" />
                  {q.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

