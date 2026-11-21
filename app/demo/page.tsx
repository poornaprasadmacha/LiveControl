'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/shared/Navbar';
import { socket } from '@/lib/socket';
import { Presentation, HelpCircle, Sparkles, ExternalLink } from 'lucide-react';
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
    <div className="min-h-screen bg-brand-bgLight dark:bg-brand-darkBg text-slate-800 dark:text-slate-100 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-12 space-y-8">
        
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-700">
            <Sparkles className="w-3.5 h-3.5 text-brand-secondary" />
            <span>Interactive Simulator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            LiveControl Simulator
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
            Test real-time vertical slide synchronization and live quiz controls by opening host and audience windows.
          </p>
        </div>

        {/* Demo Launch Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          
          <div className="bg-white dark:bg-brand-darkCard border border-slate-200 dark:border-brand-darkBorder rounded-2xl p-6 space-y-3.5">
            <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center border border-slate-200 dark:border-slate-700">
              <Presentation className="w-5 h-5 text-brand-primary dark:text-slate-200" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Vertical Presentation Demo
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Pre-loaded with 32 vertical slides on "Priority Bible Study" (with pinned top scripture reference for slides 2–15). Experience the audience vertical view with zero header and footer distractions.
            </p>
            <button
              onClick={() => createDemoRoom('presentation')}
              disabled={isLoading}
              className="w-full py-2.5 bg-brand-primary hover:bg-brand-primaryDark text-white font-bold text-xs rounded-xl transition-all"
            >
              Launch Presentation Demo
            </button>
          </div>

          <div className="bg-white dark:bg-brand-darkCard border border-slate-200 dark:border-brand-darkBorder rounded-2xl p-6 space-y-3.5">
            <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center border border-slate-200 dark:border-slate-700">
              <HelpCircle className="w-5 h-5 text-brand-secondary" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Live Quiz Demo
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Pre-loaded with 10 questions on "AI Fundamentals". Open participant windows, submit answers, and reveal live leaderboards.
            </p>
            <button
              onClick={() => createDemoRoom('quiz')}
              disabled={isLoading}
              className="w-full py-2.5 bg-brand-secondary hover:bg-brand-secondaryDark text-white font-bold text-xs rounded-xl transition-all"
            >
              Launch Quiz Demo
            </button>
          </div>
        </div>

        {/* Active Demo Window Controls */}
        {activeRoomId && (
          <div className="bg-white dark:bg-brand-darkCard border border-slate-300 dark:border-slate-700 rounded-2xl p-6 space-y-4 text-center">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-secondary">
                Demo Room Ready
              </span>
              <h2 className="text-xl font-mono font-bold text-slate-900 dark:text-white">
                {activeRoomId}
              </h2>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto font-medium">
              Open the Host Dashboard in one tab, and the Audience view in a second tab.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
              <button
                onClick={openAdminTab}
                className="w-full sm:w-auto px-5 py-2.5 bg-brand-primary hover:bg-brand-primaryDark text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open Admin Dashboard</span>
              </button>

              <button
                onClick={openViewerTab}
                className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5 text-brand-secondary" />
                <span>Open Audience View</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
