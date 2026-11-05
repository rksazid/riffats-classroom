import { requireUser } from '@/features/auth/guards';
import { db } from '@/lib/db';
import Link from 'next/link';
import { Award, Download, ShieldCheck, ArrowRight, BookOpen } from 'lucide-react';
import { formatDhakaDateOnly } from '@/lib/timezone';

export default async function StudentCertificatesPage() {
  const user = await requireUser();

  const certificates = await db.certificate.findMany({
    where: { userId: user.id, isRevoked: false },
    orderBy: { issuedAt: 'desc' },
  });

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm">
          <div>
            <span className="text-xs font-bold text-pink-600 uppercase tracking-wider block">
              Official Academic Records
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              My Earned Certificates
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Download your authenticated PDF completion certificates and share verification links.
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-pink-50 border border-pink-200 flex items-center justify-center text-pink-600 shrink-0">
            <Award className="w-7 h-7" />
          </div>
        </div>

        {/* Certificates Grid */}
        {certificates.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center space-y-4">
            <Award className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">
              No certificates earned yet
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Enroll in a recorded course, complete all mandatory lessons, and pass the assessments to earn your certificate!
            </p>
            <Link
              href="/courses"
              className="inline-block px-5 py-2.5 bg-teal-800 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              Browse Recorded Courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col justify-between card-hover-lift space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 text-[11px] font-bold rounded-lg border border-emerald-200 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Verified</span>
                    </span>
                    <span className="text-[11px] font-bold text-slate-400">
                      {formatDhakaDateOnly(cert.issuedAt)}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-slate-900 leading-snug">
                    {cert.courseTitle}
                  </h3>

                  <p className="text-xs text-slate-500 mt-1">
                    Certificate ID: <strong className="text-slate-700">{cert.certificateNumber}</strong>
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                  <a
                    href={`/api/certificates/${cert.id}/pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 px-4 bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs text-center rounded-xl transition-colors shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </a>

                  <Link
                    href={`/verify/${cert.verificationCode}`}
                    className="px-4 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition-colors"
                  >
                    Verify
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
