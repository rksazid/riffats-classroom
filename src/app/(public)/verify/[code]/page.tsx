import { db } from '@/lib/db';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, AlertCircle, Award, Calendar, CheckCircle2, ArrowRight } from 'lucide-react';
import { formatDhakaDateOnly } from '@/lib/timezone';

interface VerifyPageProps {
  params: Promise<{ code: string }>;
}

export default async function CertificateVerificationPage({ params }: VerifyPageProps) {
  const { code } = await params;

  const cert = await db.certificate.findUnique({
    where: { verificationCode: code },
    include: {
      template: true,
    },
  });

  return (
    <div className="py-16 bg-slate-50 min-h-[calc(100vh-160px)] flex items-center justify-center">
      <div className="max-w-xl w-full px-4 sm:px-6">
        
        {cert && !cert.isRevoked ? (
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-emerald-200 shadow-xl text-center space-y-6">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <ShieldCheck className="w-10 h-10" />
            </div>

            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
                Authentic & Verified Certificate
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                Official Credential Verification
              </h1>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 text-left space-y-4">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase">
                  Recipient Name
                </span>
                <p className="text-lg font-black text-slate-900">
                  {cert.studentName}
                </p>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-400 uppercase">
                  Course Completed
                </span>
                <p className="text-base font-bold text-teal-800">
                  {cert.courseTitle}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200/80 text-xs">
                <div>
                  <span className="text-slate-400 font-semibold">Certificate Number</span>
                  <p className="font-extrabold text-slate-900">{cert.certificateNumber}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold">Issue Date</span>
                  <p className="font-extrabold text-slate-900">{formatDhakaDateOnly(cert.issuedAt)}</p>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              This credential was issued by <strong>Riffat&apos;s Classroom</strong> following verified completion of all curriculum lessons and required assessments.
            </p>

            <div className="pt-2 flex items-center justify-center gap-4">
              <a
                href={`/api/certificates/${cert.id}/pdf`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
              >
                <Award className="w-4 h-4" />
                <span>View Official PDF</span>
              </a>
              <Link
                href="/"
                className="px-5 py-2.5 border border-slate-300 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-100 transition-colors"
              >
                Home
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-red-200 shadow-xl text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
              <AlertCircle className="w-10 h-10" />
            </div>

            <h1 className="text-2xl font-black text-slate-900">
              Certificate Not Verified
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              The verification code provided does not match any valid active certificate in our records. Please verify the URL or contact school administration.
            </p>

            <div className="pt-4">
              <Link
                href="/"
                className="px-6 py-2.5 bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs rounded-xl transition-colors inline-block"
              >
                Return to Homepage
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
