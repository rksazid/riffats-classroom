import Link from 'next/link';
import Image from 'next/image';
import { Youtube, Linkedin, Mail, MapPin, Heart, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-pink-500/30">
                <Image
                  src="/images/logo.png"
                  alt="Riffat's Classroom"
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                Riffat&apos;s <span className="text-pink-400">Classroom</span>
              </span>
            </Link>
            
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              &ldquo;Learn English. Build Confidence. Shine Brighter.&rdquo;
              <br />
              A warm, student-centered digital classroom providing structured grammar mastery, daily challenges, and exam preparation for young learners.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.youtube.com/@riffats.classroom/videos"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-800 text-pink-400 hover:bg-pink-600 hover:text-white transition-colors"
                aria-label="YouTube Channel"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/posts/riffat-s-classroom_mastering-sentences-full-slide-activity-7241377935792689152-io-o"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-800 text-teal-400 hover:bg-teal-600 hover:text-white transition-colors"
                aria-label="LinkedIn Educational Post"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="mailto:contact@riffatsclassroom.com"
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                aria-label="Email Support"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Learn & Explore */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Learn & Practice
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/lessons" className="hover:text-pink-400 transition-colors">
                  Grammar Lessons
                </Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-pink-400 transition-colors">
                  Structured Courses
                </Link>
              </li>
              <li>
                <Link href="/daily-challenge" className="hover:text-pink-400 transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse"></span>
                  Daily Challenge
                </Link>
              </li>
              <li>
                <Link href="/quizzes" className="hover:text-pink-400 transition-colors">
                  Practice Quizzes & Exams
                </Link>
              </li>
            </ul>
          </div>

          {/* Community & School */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Community & Info
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="hover:text-teal-400 transition-colors">
                  About Teacher Riffat
                </Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-teal-400 transition-colors">
                  Discussion Forums
                </Link>
              </li>
              <li>
                <Link href="/notices" className="hover:text-teal-400 transition-colors">
                  School Notices
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-teal-400 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Demra, Dhaka & Safety */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Trust & Safety
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
                <span>Demra Staff Quarter, Demra, Dhaka, Bangladesh</span>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Child-safe learning environment with moderated discussions and zero third-party ads.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Riffat&apos;s Classroom. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-slate-400 transition-colors">
              Child Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-slate-400 transition-colors">
              Terms of Use
            </Link>
            <Link href="/about" className="hover:text-slate-400 transition-colors">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
