import { db } from '@/lib/db';
import { Bell, Calendar, Pin } from 'lucide-react';
import { formatDhakaDateOnly } from '@/lib/timezone';

export default async function NoticesPage() {
  const notices = await db.notice.findMany({
    orderBy: [{ isPinned: 'desc' }, { publishedAt: 'desc' }],
  });

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold uppercase tracking-wider">
            <Bell className="w-3.5 h-3.5" />
            <span>School Announcements</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Notices & Updates
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Important exam notices, holiday alerts, and learning platform updates from Teacher Riffat.
          </p>
        </div>

        <div className="space-y-4">
          {notices.map((notice) => (
            <div
              key={notice.id}
              className={`p-6 sm:p-8 rounded-3xl border shadow-xs space-y-3 bg-white ${
                notice.isPinned ? 'border-pink-300 ring-2 ring-pink-500/10' : 'border-slate-200/90'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {notice.isPinned && (
                    <span className="px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-700 text-[10px] font-extrabold flex items-center gap-1">
                      <Pin className="w-3 h-3" />
                      Pinned Notice
                    </span>
                  )}
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                    {notice.priority} Priority
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{formatDhakaDateOnly(notice.publishedAt)}</span>
                </div>
              </div>

              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                {notice.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {notice.content}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

