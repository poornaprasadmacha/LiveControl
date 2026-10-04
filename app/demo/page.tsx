'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/shared/Navbar';
import { socket } from '@/lib/socket';
import { Presentation, HelpCircle, Sparkles, ExternalLink, ArrowRight } from 'lucide-react';
import { SAMPLE_PRESENTATION_TITLE } from '@/lib/samplePresentation';
import { SAMPLE_QUIZ_TITLE } from '@/lib/sampleQuiz';

export default function DemoPage() {
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<'presentation' | 'quiz' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const createDemoRoom = (type: 'presentation' | 'quiz') => {
    setIsLoading(true);
    if (!socket.connected) {
      socket.connect();
    }

    const title = type === 'presentation' ? SAMPLE_PRESENTATION_TITLE : SAMPLE_QUIZ_TITLE;
    const pin = 'admin123';

    socket.emit('createRoom', { type, title, pin }, (res) => {
      setIsLoading(false);
      if (res.success && res.roomId && res.adminToken) {
        sessionStorage.setItem(`lc_admin_token_${res.roomId}`, res.adminToken);
        setActiveRoomId(res.roomId);
        setActiveType(type);
      }
    });
  };

  const openAdminTab = () => {
    if (activeRoomId) {
      window.open(`/admin/${activeRoomId}`, '_blank');
    }
  };

  const openViewerTab = () => {
    if (activeRoomId) {
      window.open(`/room/${activeRoomId}`, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-brand-bgLight dark:bg-brand-darkBg text-slate-900 dark:text-white flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-12 space-y-8">
        
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 dark:bg-brand-darkBg text-brand-secondary text-xs font-bold border border-teal-200">
            <Sparkles className="w-4 h-4 text-brand-secondary animate-pulse" />
            <span>Interactive Multi-Tab Simulator</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            LiveControl Interactive Demo
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Test real-time slide synchronization and live quiz controls by opening host and viewer windows side by side.
          </p>
        </div>

        {/* Demo Launch Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          
          <div className="bg-white dark:bg-brand-darkCard border border-sky-100 dark:border-brand-darkBorder rounded-3xl p-6 shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-light/60 dark:bg-brand-secondary/20 text-brand-primary dark:text-brand-light flex items-center justify-center">
              <Presentation className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Demo Presentation
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Pre-loaded with 8 sample slides on "Introduction to AI". Change slides on the host window and observe instant audience updates.
            </p>
            <button
              onClick={() => createDemoRoom('presentation')}
              disabled={isLoading}
              className="w-full py-3 bg-brand-primary hover:bg-brand-primaryDark text-white font-bold text-xs rounded-xl shadow-md transition-all"
            >
              Launch Presentation Demo
            </button>
          </div>

          <div className="bg-white dark:bg-brand-darkCard border border-sky-100 dark:border-brand-darkBorder rounded-3xl p-6 shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-brand-darkBg text-brand-secondary flex items-center justify-center">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Demo Live Quiz
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Pre-loaded with 10 questions on "AI Fundamentals". Open participant windows, submit answers, and reveal live leaderboards.
            </p>
            <button
              onClick={() => createDemoRoom('quiz')}
              disabled={isLoading}
              className="w-full py-3 bg-brand-secondary hover:bg-brand-secondaryDark text-white font-bold text-xs rounded-xl shadow-md transition-all"
            >
              Launch Quiz Demo
            </button>
          </div>
        </div>

        {/* Active Demo Window Controls */}
        {activeRoomId && (
          <div className="bg-white dark:bg-brand-darkCard border-2 border-brand-primary rounded-3xl p-8 shadow-2xl space-y-6 text-center animate-in fade-in duration-300">
            <div className="space-y-1">
              <span className="text-xs font-black uppercase tracking-widest text-brand-secondary">
                Demo Room Ready!
              </span>
              <h2 className="text-2xl font-black font-mono text-brand-primary dark:text-brand-light">
                {activeRoomId}
              </h2>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto font-medium">
              Click below to open the Admin Host Dashboard in one tab, and the Audience / Participant view in a second tab!
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                onClick={openAdminTab}
                className="w-full sm:w-auto px-6 py-3.5 bg-brand-primary hover:bg-brand-primaryDark text-white font-black text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open Admin Dashboard (Tab 1)</span>
              </button>

              <button
                onClick={openViewerTab}
                className="w-full sm:w-auto px-6 py-3.5 bg-brand-secondary hover:bg-brand-secondaryDark text-white font-black text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open Audience View (Tab 2)</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
