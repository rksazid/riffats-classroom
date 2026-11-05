import Image from 'next/image';
import Link from 'next/link';
import { Award, BookOpen, Heart, ShieldCheck, MapPin, Youtube, Linkedin, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 text-pink-600" />
            <span>Teacher & Pedagogical Vision</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            About Riffat&apos;s Classroom
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            Making English grammar understandable, engaging, and confidence-building for young learners across Bangladesh.
          </p>
        </div>

        {/* Teacher Story Grid */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-4 flex justify-center">
            <div className="w-60 h-60 rounded-3xl overflow-hidden ring-4 ring-pink-500/20 shadow-lg">
              <Image
                src="/images/logo.png"
                alt="Teacher Riffat Nasrin"
                width={240}
                height={240}
                className="object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-teal-800">
              <MapPin className="w-4 h-4 text-pink-600" />
              <span>Demra Staff Quarter, Demra, Dhaka, Bangladesh</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Teaching with Heart and Clarity
            </h2>

            <p className="text-sm text-slate-600 leading-relaxed">
              Riffat&apos;s Classroom was created by Riffat Nasrin, an experienced English educator who formerly taught at <strong>Hajee Moajjem Ali High School</strong> in Demra, Dhaka.
            </p>

            <p className="text-sm text-slate-600 leading-relaxed">
              Her passion is breaking down complex English structures — such as identifying subjects and objects, direct vs. indirect objects, definite/indefinite articles, and forming interrogative questions — into simple, joyful, and memorable daily habits.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <a
                href="https://www.youtube.com/@riffats.classroom/videos"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-pink-600 hover:bg-pink-700 shadow-xs transition-colors flex items-center gap-2"
              >
                <Youtube className="w-4 h-4" />
                <span>Watch YouTube Video Lessons</span>
              </a>

              <a
                href="https://www.linkedin.com/posts/riffat-s-classroom_mastering-sentences-full-slide-activity-7241377935792689152-io-o"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl font-bold text-xs text-teal-900 bg-teal-50 hover:bg-teal-100 border border-teal-200 transition-colors flex items-center gap-2"
              >
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn Educational Posts</span>
              </a>
            </div>
          </div>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-pink-50 border border-pink-200 flex items-center justify-center text-pink-600">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900">
              Structured Foundation
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Lessons follow a clear progression from core sentence architecture to nuanced question building and exam prep.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900">
              Daily Practice Habit
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              The Daily Grammar Challenge gives students an achievable 5-minute workout to maintain their learning streak.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900">
              Child-Safe Environment
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Designed specifically for ages 6–18: moderated discussions, zero third-party tracking, and protected student identities.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

