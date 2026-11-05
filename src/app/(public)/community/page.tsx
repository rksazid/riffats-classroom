import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import Link from 'next/link';
import { MessageSquare, PlusCircle, HelpCircle, Lightbulb, Users, ArrowRight } from 'lucide-react';
import { formatDhakaDateOnly } from '@/lib/timezone';
import { createThreadAction } from '@/features/community/actions';

export default async function CommunityForumPage() {
  const user = await getCurrentUser();

  const [categories, threads] = await Promise.all([
    db.forumCategory.findMany({
      orderBy: { orderIndex: 'asc' },
      include: {
        _count: { select: { threads: true } },
      },
    }),
    db.forumThread.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        category: true,
        author: { select: { name: true, gradeLevel: true } },
        _count: { select: { posts: true } },
      },
    }),
  ]);

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/90 shadow-sm">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Safe Learning Community</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Grammar Discussion Forums
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
              Ask English questions, discuss confusing sentences, and receive answers from teachers and fellow students in a supportive, moderated space.
            </p>
          </div>

          <div>
            {user ? (
              <a
                href="#ask-question"
                className="px-5 py-3 bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Ask a Grammar Question</span>
              </a>
            ) : (
              <Link
                href="/sign-in?returnTo=/community"
                className="px-5 py-3 bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
              >
                <span>Sign in to Post</span>
              </Link>
            )}
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-pink-50 border border-pink-200 flex items-center justify-center text-pink-600 mb-3">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900 mb-1">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>{cat._count.threads} Threads</span>
              </div>
            </div>
          ))}
        </div>

        {/* Active Discussions List */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">
            Recent Questions & Discussions
          </h2>

          <div className="divide-y divide-slate-100">
            {threads.map((thread) => (
              <div key={thread.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-pink-600 uppercase tracking-wide">
                    {thread.category.name}
                  </span>
                  <Link
                    href={`/community/threads/${thread.slug}`}
                    className="block text-base font-extrabold text-slate-900 hover:text-teal-800 transition-colors"
                  >
                    {thread.title}
                  </Link>
                  <p className="text-xs text-slate-500">
                    Asked by <span className="font-semibold text-slate-700">{thread.author.name}</span> •{' '}
                    {formatDhakaDateOnly(thread.createdAt)}
                  </p>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-xs font-bold px-3 py-1 bg-slate-100 text-slate-700 rounded-lg">
                    {thread._count.posts} {thread._count.posts === 1 ? 'Reply' : 'Replies'}
                  </span>
                  <Link
                    href={`/community/threads/${thread.slug}`}
                    className="text-xs font-bold text-teal-800 hover:text-teal-900 flex items-center gap-1"
                  >
                    <span>Read</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ask Question Form (If signed in) */}
        {user && (
          <div id="ask-question" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4 scroll-mt-28">
            <h3 className="text-lg font-bold text-slate-900">
              Ask a New Grammar Question
            </h3>
            <p className="text-xs text-slate-500">
              Be specific about the sentence or rule you want help with.
            </p>

            <form action={createThreadAction} className="space-y-4 max-w-2xl">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Category
                </label>
                <select
                  name="categoryId"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-pink-500 outline-hidden bg-white"
                  required
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Question Title / Sentence
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="e.g. Is it 'between you and I' or 'between you and me'?"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-pink-500 outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Detailed Explanation
                </label>
                <textarea
                  name="content"
                  rows={4}
                  placeholder="Explain what part is confusing or write down the full sentence context..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-pink-500 outline-hidden"
                  required
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                Post Question
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
