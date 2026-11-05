import { ShieldCheck, Lock, UserCheck } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Child-Safe Protection</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Child Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Our strict commitment to protecting young learners&apos; privacy and personal data.
          </p>
        </div>

        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/90 shadow-sm space-y-6 text-sm text-slate-700 leading-relaxed">
          <h2 className="text-xl font-bold text-slate-900">1. Minimal Information Collection</h2>
          <p>
            Riffat&apos;s Classroom serves students aged 6–18. We collect only the minimum required information to provide learning services: a display name, an email address (or guardian-linked identifier), and school grade level. We do not require children to upload personal identification or physical addresses.
          </p>

          <h2 className="text-xl font-bold text-slate-900">2. No Third-Party Advertising or Profiling</h2>
          <p>
            We do not sell student data, use behavioral ad targeting, or allow commercial third-party trackers on student learning screens.
          </p>

          <h2 className="text-xl font-bold text-slate-900">3. Private Assessment Results by Default</h2>
          <p>
            Individual quiz attempts, scores, and practice records are strictly private to the student and authorized instructors. Scores are never posted publicly without explicit consent.
          </p>

          <h2 className="text-xl font-bold text-slate-900">4. Guardian Controls</h2>
          <p>
            Parents and guardians can request to review, link, or permanently delete their child&apos;s account and learning history by contacting us at <code>contact@riffatsclassroom.com</code>.
          </p>
        </div>

      </div>
    </div>
  );
}
