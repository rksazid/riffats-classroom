import { requireUser } from '@/features/auth/guards';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { User, ShieldCheck, Save, Mail, GraduationCap } from 'lucide-react';

async function updateProfileAction(formData: FormData) {
  'use server';
  const user = await requireUser();

  const name = (formData.get('name') as string)?.trim();
  const bengaliName = (formData.get('bengaliName') as string)?.trim();
  const gradeLevel = formData.get('gradeLevel') as string;

  if (!name) {
    throw new Error('Name cannot be empty.');
  }

  await db.user.update({
    where: { id: user.id },
    data: {
      name,
      bengaliName: bengaliName || null,
      gradeLevel: gradeLevel || null,
    },
  });

  revalidatePath('/student/profile');
  revalidatePath('/student/dashboard');
}

export default async function StudentProfilePage() {
  const user = await requireUser();
  const fullUser = await db.user.findUnique({
    where: { id: user.id },
    include: { roles: true },
  });

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-8">
        
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800 font-black text-xl">
              {user.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900">
                Learner Profile Settings
              </h1>
              <p className="text-xs text-slate-500">
                Update your learning display name and school grade.
              </p>
            </div>
          </div>

          <form action={updateProfileAction} className="space-y-4 pt-4 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Display Name
              </label>
              <input
                type="text"
                name="name"
                defaultValue={fullUser?.name}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-pink-500 outline-hidden font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Bengali Name (ঐচ্ছিক / Optional)
              </label>
              <input
                type="text"
                name="bengaliName"
                defaultValue={fullUser?.bengaliName || ''}
                placeholder="বাংলা নাম"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-pink-500 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Email Address (Account ID)
              </label>
              <input
                type="email"
                defaultValue={fullUser?.email}
                disabled
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-100 text-slate-500 cursor-not-allowed"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Email is locked for account safety.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                School Class / Grade Level
              </label>
              <select
                name="gradeLevel"
                defaultValue={fullUser?.gradeLevel || 'Class 8'}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-pink-500 outline-hidden bg-white font-medium"
              >
                <option value="Class 6">Class 6</option>
                <option value="Class 7">Class 7</option>
                <option value="Class 8">Class 8</option>
                <option value="Class 9">Class 9</option>
                <option value="Class 10">Class 10</option>
                <option value="HSC">HSC / College</option>
                <option value="All Levels">All Levels / General</option>
              </select>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
