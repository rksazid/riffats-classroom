import { requireTeacher } from '@/features/auth/guards';
import { db } from '@/lib/db';
import Link from 'next/link';
import { ArrowLeft, HelpCircle, Save } from 'lucide-react';
import { createQuestionAction } from '@/features/questions/actions';

export default async function NewQuestionPage() {
  await requireTeacher();

  const topics = await db.topic.findMany({
    orderBy: { orderIndex: 'asc' },
  });

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <Link
          href="/teacher/question-bank"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-teal-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Question Bank</span>
        </Link>

        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm space-y-6">
          <div>
            <span className="text-xs font-bold text-pink-600 uppercase tracking-wider block">
              Assessment Engine
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Add Question to Bank
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Create an immutable question snapshot with options and teacher explanation.
            </p>
          </div>

          <form action={createQuestionAction} className="space-y-6">
            
            {/* Topic & Type & Grade Level */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Grammar Topic
                </label>
                <select
                  name="topicId"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-pink-500 outline-hidden bg-white"
                  required
                >
                  {topics.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Question Format
                </label>
                <select
                  name="type"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-pink-500 outline-hidden bg-white"
                >
                  <option value="SINGLE_MCQ">Single Choice MCQ</option>
                  <option value="MULTIPLE_MCQ">Multiple Choice MCQ</option>
                  <option value="TRUE_FALSE">True / False</option>
                  <option value="FILL_BLANK">Fill in the Blank</option>
                  <option value="MATCHING">Matching Pairs</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Grade / Level
                </label>
                <select
                  name="gradeLevel"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-pink-500 outline-hidden bg-white"
                >
                  <option value="Class 6">Class 6</option>
                  <option value="Class 7">Class 7</option>
                  <option value="Class 8">Class 8</option>
                  <option value="Class 9 - 10">Class 9 - 10</option>
                  <option value="All Levels">All Levels</option>
                </select>
              </div>
            </div>

            {/* Question Text */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Question Text
              </label>
              <textarea
                name="questionText"
                rows={3}
                placeholder="e.g. Which of the following is a Direct Object in: 'She gave him a dictionary'?"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-pink-500 outline-hidden font-medium"
                required
              />
            </div>

            {/* Answer Options (A, B, C, D) */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-4">
              <span className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Answer Options & Correct Answer Selection
              </span>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="correctOptionKey"
                    value="A"
                    defaultChecked
                    className="w-4 h-4 text-pink-600 focus:ring-pink-500"
                    title="Mark Option A as correct"
                  />
                  <span className="w-6 text-xs font-black text-slate-700">A:</span>
                  <input
                    type="text"
                    name="optA"
                    placeholder="Option A text"
                    className="flex-1 px-4 py-2 rounded-xl border border-slate-300 text-sm focus:border-pink-500 outline-hidden bg-white"
                    required
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="correctOptionKey"
                    value="B"
                    className="w-4 h-4 text-pink-600 focus:ring-pink-500"
                    title="Mark Option B as correct"
                  />
                  <span className="w-6 text-xs font-black text-slate-700">B:</span>
                  <input
                    type="text"
                    name="optB"
                    placeholder="Option B text"
                    className="flex-1 px-4 py-2 rounded-xl border border-slate-300 text-sm focus:border-pink-500 outline-hidden bg-white"
                    required
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="correctOptionKey"
                    value="C"
                    className="w-4 h-4 text-pink-600 focus:ring-pink-500"
                    title="Mark Option C as correct"
                  />
                  <span className="w-6 text-xs font-black text-slate-700">C:</span>
                  <input
                    type="text"
                    name="optC"
                    placeholder="Option C text (optional)"
                    className="flex-1 px-4 py-2 rounded-xl border border-slate-300 text-sm focus:border-pink-500 outline-hidden bg-white"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="correctOptionKey"
                    value="D"
                    className="w-4 h-4 text-pink-600 focus:ring-pink-500"
                    title="Mark Option D as correct"
                  />
                  <span className="w-6 text-xs font-black text-slate-700">D:</span>
                  <input
                    type="text"
                    name="optD"
                    placeholder="Option D text (optional)"
                    className="flex-1 px-4 py-2 rounded-xl border border-slate-300 text-sm focus:border-pink-500 outline-hidden bg-white"
                  />
                </div>
              </div>

              <p className="text-[11px] text-slate-500">
                Radio button marks the correct option. (Never exposed to students during exam attempts).
              </p>
            </div>

            {/* Explanation */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Teacher Explanation (Shown after completion)
              </label>
              <textarea
                name="explanation"
                rows={3}
                placeholder="Explain why the answer is correct and what grammatical rule applies..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-pink-500 outline-hidden"
              />
            </div>

            {/* Points and Tags */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Marks / Points
                </label>
                <input
                  type="number"
                  step="0.5"
                  name="points"
                  defaultValue="1.0"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-pink-500 outline-hidden font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Topic Tags (comma-separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  placeholder="e.g. subject, verbs, class-8"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-pink-500 outline-hidden"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <Link
                href="/teacher/question-bank"
                className="px-5 py-2.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="px-6 py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Question to Bank</span>
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}

