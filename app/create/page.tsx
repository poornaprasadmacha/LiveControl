'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/shared/Navbar';
import { socket } from '@/lib/socket';
import { Presentation, HelpCircle, Lock, ArrowRight, AlertTriangle, ExternalLink } from 'lucide-react';
import { SAMPLE_PRESENTATION_TITLE } from '@/lib/samplePresentation';
import { SAMPLE_QUIZ_TITLE } from '@/lib/sampleQuiz';

export default function CreateSessionPage() {
  const router = useRouter();
  const [sessionType, setSessionType] = useState<'presentation' | 'quiz'>('presentation');
  const [title, setTitle] = useState(SAMPLE_PRESENTATION_TITLE);
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const socketServerUrl = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || 'http://localhost:3001';

  useEffect(() => {
    if (sessionType === 'presentation') {
      setTitle(SAMPLE_PRESENTATION_TITLE);
    } else {
      setTitle(SAMPLE_QUIZ_TITLE);
    }
  }, [sessionType]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please enter a session title.');
      return;
    }

    setIsLoading(true);
    setError(null);

    // Timeout safety fallback (5 seconds)
    const timer = setTimeout(() => {
      setIsLoading((currentlyLoading) => {
        if (currentlyLoading) {
          setError(
            `Connection Timeout: Could not reach backend server at ${socketServerUrl}.\n\nIf you deployed on Vercel, please set NEXT_PUBLIC_SOCKET_SERVER_URL in Vercel settings to your active backend (e.g. Render.com).`
          );
          return false;
        }
        return false;
      });
    }, 5000);

    // 1. Try REST API endpoint first for instant room creation
    try {
      const res = await fetch(`${socketServerUrl}/api/create-room`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: sessionType, title: title.trim(), pin: pin.trim() }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.roomId && data.adminToken) {
          clearTimeout(timer);
          sessionStorage.setItem(`lc_admin_token_${data.roomId}`, data.adminToken);
          router.push(`/admin/${data.roomId}`);
          return;
        }
      }
    } catch (httpErr) {
      // If REST API fetch failed or server unreachable, fallback to Socket.IO
    }

    // 2. Fallback to Socket.IO emit
    if (!socket.connected) {
      socket.connect();
    }

    socket.emit('createRoom', { type: sessionType, title: title.trim(), pin: pin.trim() }, (res) => {
      clearTimeout(timer);
      setIsLoading(false);
      if (res.success && res.roomId && res.adminToken) {
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
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-600 dark:text-amber-400">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Backend Server Unreachable</span>
                </div>
                <p className="whitespace-pre-line text-[11px] font-medium leading-relaxed">
                  {error}
                </p>
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
