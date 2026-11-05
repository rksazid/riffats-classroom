import { requireAdmin } from '@/features/auth/guards';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import { ArrowLeft, Settings, Save } from 'lucide-react';

async function updateSiteSettingsAction(formData: FormData) {
  'use server';
  await requireAdmin();

  const tagline = (formData.get('tagline') as string)?.trim();
  const contactEmail = (formData.get('contact_email') as string)?.trim();
  const youtubeUrl = (formData.get('youtube_url') as string)?.trim();
  const linkedinUrl = (formData.get('linkedin_url') as string)?.trim();

  if (tagline) {
    await db.siteSetting.upsert({
      where: { key: 'tagline' },
      update: { value: JSON.stringify(tagline) },
      create: { key: 'tagline', value: JSON.stringify(tagline) },
    });
  }

  if (contactEmail) {
    await db.siteSetting.upsert({
      where: { key: 'contact_email' },
      update: { value: JSON.stringify(contactEmail) },
      create: { key: 'contact_email', value: JSON.stringify(contactEmail) },
    });
  }

  if (youtubeUrl) {
    await db.siteSetting.upsert({
      where: { key: 'youtube_url' },
      update: { value: JSON.stringify(youtubeUrl) },
      create: { key: 'youtube_url', value: JSON.stringify(youtubeUrl) },
    });
  }

  if (linkedinUrl) {
    await db.siteSetting.upsert({
      where: { key: 'linkedin_url' },
      update: { value: JSON.stringify(linkedinUrl) },
      create: { key: 'linkedin_url', value: JSON.stringify(linkedinUrl) },
    });
  }

  revalidatePath('/');
  revalidatePath('/about');
  revalidatePath('/admin/site-settings');
}

export default async function AdminSiteSettingsPage() {
  await requireAdmin();

  const settingsList = await db.siteSetting.findMany();
  const settingsMap: Record<string, string> = {};
  for (const s of settingsList) {
    try {
      settingsMap[s.key] = JSON.parse(s.value);
    } catch {
      settingsMap[s.key] = s.value;
    }
  }

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-teal-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Admin Console</span>
        </Link>

        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900">
                Site & Branding Settings
              </h1>
              <p className="text-xs text-slate-500">
                Update public website parameters and verified channels.
              </p>
            </div>
          </div>

          <form action={updateSiteSettingsAction} className="space-y-4 pt-4 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Tagline / Motto
              </label>
              <input
                type="text"
                name="tagline"
                defaultValue={settingsMap.tagline || 'Learn English. Build Confidence. Shine Brighter.'}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-pink-500 outline-hidden font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Public Support Email
              </label>
              <input
                type="email"
                name="contact_email"
                defaultValue={settingsMap.contact_email || 'contact@riffatsclassroom.com'}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-pink-500 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Official YouTube URL
              </label>
              <input
                type="url"
                name="youtube_url"
                defaultValue={settingsMap.youtube_url || 'https://www.youtube.com/@riffats.classroom/videos'}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-pink-500 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Official LinkedIn Post / Profile URL
              </label>
              <input
                type="url"
                name="linkedin_url"
                defaultValue={settingsMap.linkedin_url || 'https://www.linkedin.com/posts/riffat-s-classroom_mastering-sentences-full-slide-activity-7241377935792689152-io-o'}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-pink-500 outline-hidden"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Site Settings</span>
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
