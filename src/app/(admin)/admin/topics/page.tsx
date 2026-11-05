import { requireAdmin } from '@/features/auth/guards';
import { db } from '@/lib/db';
import Link from 'next/link';
import { BookOpen, ArrowLeft, Plus, Sparkles, Layers } from 'lucide-react';
import TopicManagementClient from '@/components/admin/TopicManagementClient';

export default async function AdminTopicsPage() {
  await requireAdmin();

  const [subjects, topics] = await Promise.all([
    db.subject.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    }),
    db.topic.findMany({
      orderBy: { orderIndex: 'asc' },
      include: {
        subject: {
          select: { id: true, name: true },
        },
        subtopics: {
          orderBy: { createdAt: 'asc' },
          select: { id: true, name: true, slug: true },
        },
        _count: {
          select: {
            lessons: true,
            questions: true,
            quizzes: true,
            subtopics: true,
          },
        },
      },
    }),
  ]);

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm">
          <div className="space-y-1">
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-800 hover:text-teal-900 mb-2 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Admin Console</span>
            </Link>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-pink-50 text-pink-600">
                <BookOpen className="w-5 h-5" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Grammar Topics & Syllabi
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
              Super admins can dynamically create and order grammar topics and subtopics. Once added, teachers can immediately create lessons, courses, question items, and daily challenges assigned to these topics.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
            <Link
              href="/teacher/dashboard"
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
            >
              Teacher Console
            </Link>
          </div>
        </div>

        {/* Client Management Interface */}
        <TopicManagementClient topics={topics} subjects={subjects} />

      </div>
    </div>
  );
}
