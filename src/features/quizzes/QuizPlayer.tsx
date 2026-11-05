'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { saveQuizAnswerAction, submitQuizAttemptAction } from './actions';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Send,
  Sparkles,
  Save
} from 'lucide-react';

interface SanitizedOption {
  id: string;
  optionKey: string;
  optionText: string;
  orderIndex: number;
}

interface SanitizedQuestion {
  id: string;
  type: string;
  passageText?: string | null;
  questionText: string;
  points: number;
  options: SanitizedOption[];
}

interface QuizPlayerProps {
  quizTitle: string;
  quizSlug: string;
  durationMinutes: number | null;
  attemptId: string;
  initialExpiresAt: string | null;
  questions: SanitizedQuestion[];
}

export default function QuizPlayer({
  quizTitle,
  quizSlug,
  durationMinutes,
  attemptId,
  initialExpiresAt,
  questions,
}: QuizPlayerProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [textAnswers, setTextAnswers] = useState<Record<string, string>>({});
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('saved');
  const [secondsRemaining, setSecondsRemaining] = useState<number | null>(null);
  const [isSubmitting, startSubmitTransition] = useTransition();
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const currentQ = questions[currentIndex];

  // 1. Initialize and countdown server timer
  useEffect(() => {
    if (!initialExpiresAt) return;

    const expiryTime = new Date(initialExpiresAt).getTime();

    const updateTimer = () => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((expiryTime - now) / 1000));
      setSecondsRemaining(diff);

      if (diff === 0) {
        // Auto-finalize when timer hits 0
        handleSubmit();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [initialExpiresAt]);

  // 2. Format timer mm:ss
  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // 3. Option Selection Handler
  const handleSelectOption = async (optionKey: string, isMultiple: boolean) => {
    const qId = currentQ.id;
    let updated: string[];

    if (isMultiple) {
      const current = answers[qId] || [];
      if (current.includes(optionKey)) {
        updated = current.filter((k) => k !== optionKey);
      } else {
        updated = [...current, optionKey];
      }
    } else {
      updated = [optionKey];
    }

    setAnswers((prev) => ({ ...prev, [qId]: updated }));
    await autosave(qId, updated, textAnswers[qId]);
  };

  // 4. Text Input Handler
  const handleTextChange = async (val: string) => {
    const qId = currentQ.id;
    setTextAnswers((prev) => ({ ...prev, [qId]: val }));
    await autosave(qId, answers[qId] || [], val);
  };

  // 5. Autosave helper
  const autosave = async (qId: string, keys: string[], text?: string) => {
    setSaveStatus('saving');
    try {
      await saveQuizAnswerAction(attemptId, qId, keys, text);
      setSaveStatus('saved');
    } catch (err) {
      console.error('Autosave error:', err);
      setSaveStatus('error');
    }
  };

  // 6. Submit Quiz Handler
  const handleSubmit = () => {
    startSubmitTransition(async () => {
      try {
        const res = await submitQuizAttemptAction(attemptId);
        router.push(`/quizzes/${res.quizSlug}/results/${res.attemptId}`);
      } catch (err) {
        alert('Error submitting examination. Please check connection and try again.');
      }
    });
  };

  const answeredCount = Object.keys(answers).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Quiz Top Action Bar: Timer & Progress */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-24 z-40">
        <div>
          <span className="text-xs font-bold text-pink-600 uppercase tracking-wider block">
            Assessment in Progress
          </span>
          <h1 className="text-lg sm:text-xl font-black text-slate-900 truncate max-w-md">
            {quizTitle}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Server countdown timer */}
          {secondsRemaining !== null && (
            <div
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-mono text-sm font-extrabold ${
                secondsRemaining < 120
                  ? 'bg-red-50 text-red-600 border border-red-200 animate-pulse'
                  : 'bg-teal-50 text-teal-800 border border-teal-200'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>{formatTimer(secondsRemaining)}</span>
            </div>
          )}

          {/* Autosave feedback badge */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            {saveStatus === 'saved' && (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">Saved</span>
              </>
            )}
            {saveStatus === 'saving' && (
              <>
                <Save className="w-4 h-4 text-amber-500 animate-spin" />
                <span>Saving...</span>
              </>
            )}
            {saveStatus === 'error' && (
              <>
                <AlertCircle className="w-4 h-4 text-red-500" />
                <span className="text-red-600">Sync issue</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Question Palette Navigation Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-2 overflow-x-auto">
        <span className="text-xs font-bold text-slate-400 mr-2 shrink-0">
          Questions:
        </span>
        {questions.map((q, idx) => {
          const isAnswered = (answers[q.id]?.length || 0) > 0 || (textAnswers[q.id]?.length || 0) > 0;
          const isCurrent = idx === currentIndex;

          return (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(idx)}
              className={`w-9 h-9 rounded-xl text-xs font-extrabold shrink-0 transition-all ${
                isCurrent
                  ? 'bg-teal-800 text-white ring-2 ring-teal-800 ring-offset-2'
                  : isAnswered
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Active Question Box */}
      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
        
        {/* Question Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <span className="px-3 py-1 bg-teal-50 text-teal-800 text-xs font-bold rounded-lg">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span className="text-xs font-bold text-slate-400">
            {currentQ.points} {currentQ.points === 1 ? 'Mark' : 'Marks'}
          </span>
        </div>

        {/* Optional Passage */}
        {currentQ.passageText && (
          <div className="p-4 rounded-2xl bg-teal-50/50 border border-teal-100 text-xs sm:text-sm text-slate-700 leading-relaxed font-serif">
            <strong>Reading Passage:</strong>
            <p className="mt-1">{currentQ.passageText}</p>
          </div>
        )}

        {/* Question Text */}
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-relaxed">
          {currentQ.questionText}
        </h2>

        {/* Options / Inputs */}
        {currentQ.type === 'FILL_BLANK' || currentQ.type === 'SHORT_ANSWER' ? (
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-600 uppercase">
              Type Your Answer Below:
            </label>
            <input
              type="text"
              value={textAnswers[currentQ.id] || answers[currentQ.id]?.[0] || ''}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="Enter answer..."
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-hidden font-medium"
            />
          </div>
        ) : (
          <div className="space-y-3">
            {currentQ.options.map((opt) => {
              const selectedList = answers[currentQ.id] || [];
              const isSelected = selectedList.includes(opt.optionKey);
              const isMultiple = currentQ.type === 'MULTIPLE_MCQ';

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.optionKey, isMultiple)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-3.5 group ${
                    isSelected
                      ? 'bg-pink-50/80 border-pink-400 text-slate-900 shadow-xs'
                      : 'bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/60'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-pink-600 text-white'
                        : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                    }`}
                  >
                    {opt.optionKey}
                  </div>
                  <span className="text-sm font-medium text-slate-800 leading-snug">
                    {opt.optionText}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Bottom Navigation Buttons */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
          <button
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-xs text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {currentIndex === questions.length - 1 ? (
            <button
              onClick={() => setShowSubmitModal(true)}
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Evaluating...' : 'Submit Assessment'}</span>
            </button>
          ) : (
            <button
              onClick={() =>
                setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))
              }
              className="px-5 py-2.5 bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>

      {/* Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full space-y-4 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-black text-slate-900">
              Ready to submit?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              You have answered {answeredCount} of {questions.length} questions. You cannot change your answers after submission.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 py-2.5 border border-slate-300 rounded-xl font-bold text-xs text-slate-700 hover:bg-slate-100"
              >
                Continue Quiz
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs rounded-xl shadow-md"
              >
                {isSubmitting ? 'Submitting...' : 'Yes, Submit'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
