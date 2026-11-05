import { requireAdmin } from '@/features/auth/guards';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import { Users, ShieldCheck, ArrowLeft } from 'lucide-react';
import { Role } from '@prisma/client';

async function assignRoleAction(userId: string, role: Role) {
  'use server';
  await requireAdmin();

  await db.userRole.upsert({
    where: {
      userId_role: { userId, role },
    },
    update: {},
    create: { userId, role },
  });

  revalidatePath('/admin/users');
}

export default async function AdminUsersPage() {
  await requireAdmin();

  const users = await db.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      roles: true,
      _count: {
        select: { courseEnrollments: true, quizAttempts: true },
      },
    },
  });

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm">
          <div>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">
              Access Control
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              User Accounts & Role Permissions ({users.length})
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Manage registered accounts, instructor roles, and student enrollments.
            </p>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="divide-y divide-slate-100">
            {users.map((u) => {
              const rolesList = u.roles.map((r) => r.role);

              return (
                <div
                  key={u.id}
                  className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800 font-extrabold text-sm shrink-0">
                      {u.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900">
                        {u.name}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {u.email} • {u.gradeLevel || 'Standard Account'}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {rolesList.map((r) => (
                      <span
                        key={r}
                        className={`text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase ${
                          r === 'SUPER_ADMIN'
                            ? 'bg-purple-100 text-purple-800'
                            : r === 'TEACHER'
                            ? 'bg-teal-100 text-teal-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
