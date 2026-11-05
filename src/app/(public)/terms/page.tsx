export default function TermsPage() {
  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Terms of Use & Community Guidelines
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Rules for maintaining a kind, respectful, and encouraging learning environment.
          </p>
        </div>

        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/90 shadow-sm space-y-6 text-sm text-slate-700 leading-relaxed">
          <h2 className="text-xl font-bold text-slate-900">1. Educational Purpose</h2>
          <p>
            Riffat&apos;s Classroom is an educational platform dedicated to English language learning. All discussions, comments, and questions must remain polite, educational, and respectful.
          </p>

          <h2 className="text-xl font-bold text-slate-900">2. Community Standards & Anti-Harassment</h2>
          <p>
            Bullying, abusive language, inappropriate content, or spam in forum discussions will result in immediate content removal and account suspension.
          </p>

          <h2 className="text-xl font-bold text-slate-900">3. Assessment Academic Integrity</h2>
          <p>
            Quizzes and examinations are intended to evaluate and encourage genuine learning. Automated submission scripts or unauthorized attempt manipulation are strictly prohibited.
          </p>

          <h2 className="text-xl font-bold text-slate-900">4. Certificates</h2>
          <p>
            Certificates of completion are issued only when verified server-side completion criteria are met. Any forged or unauthorized alteration of certificates will invalidate the credential.
          </p>
        </div>

      </div>
    </div>
  );
}
