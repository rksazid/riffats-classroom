import { requireTeacher } from '@/features/auth/guards';
import { db } from '@/lib/db';
import Link from 'next/link';
import { ArrowLeft, Award, Save, Clock, CheckCircle2 } from 'lucide-react';
import { createQuizAction } from '@/features/quizzes/actions';
import SearchableSelect from '@/components/ui/SearchableSelect';

export default async function NewQuizBuilderPage() {
  await requireTeacher();

  const [topics, questions] = await Promise.all([
    db.topic.findMany({ orderBy: { orderIndex: 'asc' } }),
    db.question.findMany({
      where: { isArchived: false },
      orderBy: { createdAt: 'desc' },
      include: { topic: true },
    }),
  ]);

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <Link
          href="/teacher/quizzes"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-teal-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Quizzes</span>
        </Link>

        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm space-y-6">
          <div>
            <span className="text-xs font-bold text-pink-600 uppercase tracking-wider block">
              Quiz Builder
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Create New Assessment
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Configure timing, passing criteria, and select questions from your central question bank.
            </p>
          </div>

          <form action={createQuizAction} className="space-y-6">
            
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Quiz Title
              </label>
              <input
                type="text"
                name="title"
                placeholder="e.g. Class 8 Grammar Term Examination: Sentence Building"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-pink-500 outline-hidden font-medium"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Instructions / Description
              </label>
              <textarea
                name="description"
                rows={2}
                placeholder="Instructions for students before starting..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-pink-500 outline-hidden"
              />
            </div>

            {/* Topic & Duration & Passing Score */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Grammar Topic
                </label>
                <SearchableSelect
                  name="topicId"
                  placeholder="General English / Mixed"
                  searchPlaceholder="Search topic..."
                  defaultValue=""
                  options={[
                    { value: '', label: 'General English / Mixed (All Topics)' },
                    ...topics.map((t) => ({
                      value: t.id,
                      label: t.name,
                    })),
                  ]}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Duration (Minutes, optional)
                </label>
                <input
                  type="number"
                  name="durationMinutes"
                  defaultValue={15}
                  placeholder="Leave empty for untimed"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-pink-500 outline-hidden font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Passing Score (%)
                </label>
                <input
                  type="number"
                  name="passingScorePercent"
                  defaultValue={60}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-pink-500 outline-hidden font-bold"
                />
              </div>
            </div>

            {/* Question Selection from Bank */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                Select Questions from Bank ({questions.length} available)
              </label>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-slate-50/50 p-2">
                {questions.map((q) => (
                  <label
                    key={q.id}
                    className="p-3 flex items-start gap-3 hover:bg-white rounded-xl cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      name="questionIds"
                      value={q.id}
                      defaultChecked
                      className="mt-1 w-4 h-4 rounded-md text-pink-600 focus:ring-pink-500"
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-sm bg-pink-100 text-pink-700">
                          {q.topic.name}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-500">
                          {q.type.replace('_', ' ')} • {q.points} Points
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-900 leading-snug">
                        {q.questionText}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <Link
                href="/teacher/quizzes"
                className="px-5 py-2.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="px-6 py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Publish Assessment</span>
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}

