'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/shared/Navbar';
import { socket } from '@/lib/socket';
import { Presentation, HelpCircle, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { SAMPLE_PRESENTATION_TITLE } from '@/lib/samplePresentation';
import { SAMPLE_QUIZ_TITLE } from '@/lib/sampleQuiz';

export default function CreateSessionPage() {
  const router = useRouter();
  const [sessionType, setSessionType] = useState<'presentation' | 'quiz'>('presentation');
  const [title, setTitle] = useState(SAMPLE_PRESENTATION_TITLE);
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sessionType === 'presentation') {
      setTitle(SAMPLE_PRESENTATION_TITLE);
    } else {
      setTitle(SAMPLE_QUIZ_TITLE);
    }
  }, [sessionType]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please enter a session title.');
      return;
    }

    setIsLoading(true);
    setError(null);

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit('createRoom', { type: sessionType, title: title.trim(), pin: pin.trim() }, (res) => {
      setIsLoading(false);
      if (res.success && res.roomId && res.adminToken) {
        // Save admin token in sessionStorage for browser session continuity
        sessionStorage.setItem(`lc_admin_token_${res.roomId}`, res.adminToken);
        router.push(`/admin/${res.roomId}`);
      } else {
        setError(res.error || 'Failed to create room.');
      }
    });
  };

  return (
    <div className="min-h-screen bg-brand-bgLight dark:bg-brand-darkBg text-slate-900 dark:text-white flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-xl w-full mx-auto px-4 py-12 flex flex-col justify-center">
        <div className="bg-white dark:bg-brand-darkCard border border-sky-100 dark:border-brand-darkBorder rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
          
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Create New Live Session
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
              Select session type and configure initial parameters.
            </p>
          </div>

          {/* Session Type Switcher */}
          <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 dark:bg-brand-darkBg rounded-2xl border border-slate-200 dark:border-brand-darkBorder">
            <button
              type="button"
              onClick={() => setSessionType('presentation')}
              className={`py-3 px-4 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all ${
                sessionType === 'presentation'
                  ? 'bg-brand-primary text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Presentation className="w-4 h-4" />
              <span>Presentation</span>
            </button>

            <button
              type="button"
              onClick={() => setSessionType('quiz')}
              className={`py-3 px-4 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all ${
                sessionType === 'quiz'
                  ? 'bg-brand-secondary text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Live Quiz</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleCreate} className="space-y-6">
            
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300">
                {sessionType === 'presentation' ? 'Presentation Title' : 'Quiz Title'}
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={sessionType === 'presentation' ? 'e.g. Introduction to AI' : 'e.g. AI Fundamentals Quiz'}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-brand-darkBorder bg-slate-50 dark:bg-brand-darkBg text-slate-900 dark:text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-brand-secondary" />
                  <span>Admin PIN (Optional Custom PIN)</span>
                </label>
                <span className="text-[10px] text-slate-400">Default fallback PIN active</span>
              </div>
              <input
                type="password"
                placeholder="Enter PIN (or leave blank to use default)"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-brand-darkBorder bg-slate-50 dark:bg-brand-darkBg text-slate-900 dark:text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all"
              />
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                This PIN is verified server-side and protects your host dashboard.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-600 dark:text-rose-400 text-xs font-bold">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-brand-primary hover:bg-brand-primaryDark text-white font-black text-sm rounded-2xl shadow-xl flex items-center justify-center gap-2 hover:shadow-2xl transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <span>Generating Room & Starting Session...</span>
              ) : (
                <>
                  <span>Create & Launch Host Control</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
