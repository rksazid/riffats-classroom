import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MessageSquare, Send, ShieldCheck, User } from 'lucide-react';
import { formatDhakaDate } from '@/lib/timezone';
import { createReplyAction } from '@/features/community/actions';

interface ThreadSlugProps {
  params: Promise<{ slug: string }>;
}

export default async function ForumThreadDetailPage({ params }: ThreadSlugProps) {
  const { slug } = await params;
  const user = await getCurrentUser();

  const thread = await db.forumThread.findUnique({
    where: { slug },
    include: {
      category: true,
      author: { select: { name: true, gradeLevel: true, image: true } },
      posts: {
        orderBy: { createdAt: 'asc' },
        include: {
          author: { select: { name: true, gradeLevel: true, image: true, roles: true } },
        },
      },
    },
  });

  if (!thread) {
    notFound();
  }

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Breadcrumb */}
        <Link
          href="/community"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-teal-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Forums</span>
        </Link>

        {/* Original Thread Post */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-bold text-pink-600 uppercase tracking-wide">
              {thread.category.name}
            </span>
            <span className="text-xs text-slate-400">
              {formatDhakaDate(thread.createdAt)}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
            {thread.title}
          </h1>

          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
            {thread.content}
          </p>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Posted by <strong className="text-slate-800">{thread.author.name}</strong> ({thread.author.gradeLevel || 'Student'})</span>
          </div>
        </div>

        {/* Replies Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900">
            {thread.posts.length} {thread.posts.length === 1 ? 'Reply' : 'Replies'}
          </h2>

          {thread.posts.map((post) => {
            const isTeacher = post.author.roles.some((r) =>
              ['SUPER_ADMIN', 'ADMIN', 'TEACHER'].includes(r.role)
            );

            return (
              <div
                key={post.id}
                className={`p-6 rounded-2xl border shadow-2xs space-y-3 ${
                  isTeacher
                    ? 'bg-teal-50/60 border-teal-200'
                    : 'bg-white border-slate-200/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-slate-900">
                      {post.author.name}
                    </span>
                    {isTeacher && (
                      <span className="px-2 py-0.5 rounded-md bg-teal-800 text-white text-[10px] font-bold">
                        Teacher Response
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {formatDhakaDate(post.createdAt)}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                  {post.content}
                </p>
              </div>
            );
          })}
        </div>

        {/* Add Reply Form */}
        {user ? (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Leave a Reply
            </h3>
            <form
              action={createReplyAction.bind(null, thread.id, thread.slug)}
              className="space-y-3"
            >
              <textarea
                name="content"
                rows={3}
                placeholder="Write your explanation, example, or follow-up question..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-pink-500 outline-hidden"
                required
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Reply</span>
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-slate-100 p-6 rounded-2xl text-center text-xs text-slate-600">
            <Link
              href={`/sign-in?returnTo=/community/threads/${thread.slug}`}
              className="font-bold text-pink-600 hover:underline"
            >
              Sign in
            </Link>{' '}
            to join this discussion and post an answer.
          </div>
        )}

      </div>
    </div>
  );
}

