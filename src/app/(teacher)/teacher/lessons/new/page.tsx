import { requireTeacher } from '@/features/auth/guards';
import { db } from '@/lib/db';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Save, Video, Sparkles } from 'lucide-react';
import { createLessonAction } from '@/features/lessons/actions';

export default async function NewLessonPage() {
  await requireTeacher();

  const topics = await db.topic.findMany({
    orderBy: { orderIndex: 'asc' },
  });

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <Link
          href="/teacher/lessons"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-teal-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Lessons</span>
        </Link>

        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm space-y-6">
          <div>
            <span className="text-xs font-bold text-pink-600 uppercase tracking-wider block">
              Lesson CMS
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Create New Grammar Lesson
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Publish recorded multimedia lessons with videos, summaries, and rich formatted notes.
            </p>
          </div>

          <form action={createLessonAction} className="space-y-6">
            
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Lesson Title
              </label>
              <input
                type="text"
                name="title"
                placeholder="e.g. Mastering Subject-Verb Agreement in Complex Sentences"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-pink-500 outline-hidden font-medium"
                required
              />
            </div>

            {/* Summary */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Short Summary (Key Takeaway)
              </label>
              <input
                type="text"
                name="summary"
                placeholder="e.g. Learn the 5 golden rules of matching singular and plural verbs."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-pink-500 outline-hidden"
              />
            </div>

            {/* Topic & Grade Level & Difficulty */}
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
                  Target Grade Level
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

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Difficulty
                </label>
                <select
                  name="difficulty"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-pink-500 outline-hidden bg-white"
                >
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                </select>
              </div>
            </div>

            {/* Video Integration */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase">
                <Video className="w-4 h-4 text-teal-700" />
                <span>Video Integration (YouTube or Direct Embed)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <select
                    name="videoProvider"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-pink-500 outline-hidden bg-white"
                  >
                    <option value="YOUTUBE">YouTube Embed</option>
                    <option value="LOOM">Loom Embed</option>
                    <option value="DIRECT">Direct Video URL</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <input
                    type="url"
                    name="videoUrl"
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-pink-500 outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Estimated Duration (Minutes)
              </label>
              <input
                type="number"
                name="durationMinutes"
                defaultValue={20}
                className="w-32 px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-pink-500 outline-hidden font-bold"
              />
            </div>

            {/* Rich Content */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Lesson Content & Notes (HTML / Markdown supported)
              </label>
              <textarea
                name="content"
                rows={10}
                placeholder="Write structured lesson notes, formulas, rules, and sentence examples..."
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:border-pink-500 outline-hidden font-mono"
                required
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <Link
                href="/teacher/lessons"
                className="px-5 py-2.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="px-6 py-2.5 bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Publish Lesson</span>
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}

