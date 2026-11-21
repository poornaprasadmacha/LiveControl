'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/shared/Navbar';
import { 
  Radio, Presentation, HelpCircle, ShieldCheck, Zap, Smartphone, 
  Trash2, ArrowRight, Sparkles 
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-brand-bgLight dark:bg-brand-darkBg text-slate-800 dark:text-slate-100 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-20">
        
        {/* Hero Section */}
        <section className="text-center space-y-6 max-w-3xl mx-auto pt-2">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold">
            <Radio className="w-3.5 h-3.5 text-brand-secondary animate-pulse" />
            <span>Server-Authoritative Control Engine</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
              LiveControl
            </h1>
            <p className="text-xl sm:text-3xl font-bold text-slate-700 dark:text-slate-200">
              Control the room. Engage everyone.
            </p>
          </div>

          <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            Real-time presentation and quiz platform where one administrator controls what everyone sees instantly with zero page reloads.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <Link
              href="/create"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-brand-primary hover:bg-brand-primaryDark text-white font-bold text-sm flex items-center justify-center gap-2.5 transition-all"
            >
              <span>Create Session</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/join"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white dark:bg-brand-darkCard hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-sm flex items-center justify-center gap-2 border border-slate-200 dark:border-brand-darkBorder transition-all"
            >
              <span>Join Session</span>
            </Link>

            <Link
              href="/demo"
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-secondary" />
              <span>Interactive Simulator</span>
            </Link>
          </div>
        </section>

        {/* Two Core Modes Section */}
        <section className="space-y-6">
          <div className="text-center space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Two Core Operating Modes
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Engineered for keynotes, interactive classrooms, and live workshops.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Mode A: Live Presentation */}
            <div className="bg-white dark:bg-brand-darkCard border border-slate-200 dark:border-brand-darkBorder rounded-2xl p-7 space-y-5 flex flex-col justify-between">
              <div className="space-y-3.5">
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                  <Presentation className="w-6 h-6 text-brand-primary dark:text-slate-200" />
                </div>
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 uppercase tracking-wider">
                  Mode A
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Live Vertical Presentation
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  The host controls the current slide in real time. Optimized with a vertical layout tailored for mobile devices with zero header and footer clutter for viewers.
                </p>
              </div>

              <ul className="space-y-2 text-xs font-medium text-slate-700 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-brand-secondary" />
                  <span>Server-authoritative slide synchronization</span>
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-brand-secondary" />
                  <span>Instant blank screen toggle and mobile responsiveness</span>
                </li>
              </ul>
            </div>

            {/* Mode B: Live Quiz */}
            <div className="bg-white dark:bg-brand-darkCard border border-slate-200 dark:border-brand-darkBorder rounded-2xl p-7 space-y-5 flex flex-col justify-between">
              <div className="space-y-3.5">
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                  <HelpCircle className="w-6 h-6 text-brand-secondary" />
                </div>
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 uppercase tracking-wider">
                  Mode B
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Live Interactive Quiz
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Audience members join using nicknames. The host manages question pacing, opens and closes responses, reveals solutions, and triggers live leaderboards.
                </p>
              </div>

              <ul className="space-y-2 text-xs font-medium text-slate-700 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-brand-secondary" />
                  <span>Server-side scoring & answer validation</span>
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-brand-secondary" />
                  <span>Exportable CSV results before memory erasure</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Built for Performance and Simplicity
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white dark:bg-brand-darkCard p-5 rounded-2xl border border-slate-200 dark:border-brand-darkBorder space-y-2.5">
              <ShieldCheck className="w-6 h-6 text-slate-700 dark:text-slate-300" />
              <h4 className="font-bold text-sm">No Viewer Accounts</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Audience members scan or click a link and participate instantly without registration.
              </p>
            </div>

            <div className="bg-white dark:bg-brand-darkCard p-5 rounded-2xl border border-slate-200 dark:border-brand-darkBorder space-y-2.5">
              <Zap className="w-6 h-6 text-brand-secondary" />
              <h4 className="font-bold text-sm">Instant Sync</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Powered by Socket.IO WebSocket connections for sub-millisecond real-time sync.
              </p>
            </div>

            <div className="bg-white dark:bg-brand-darkCard p-5 rounded-2xl border border-slate-200 dark:border-brand-darkBorder space-y-2.5">
              <Smartphone className="w-6 h-6 text-slate-700 dark:text-slate-300" />
              <h4 className="font-bold text-sm">Vertical & Mobile-First</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Vertical presentation layout optimized for phone screens and handheld viewing.
              </p>
            </div>

            <div className="bg-white dark:bg-brand-darkCard p-5 rounded-2xl border border-slate-200 dark:border-brand-darkBorder space-y-2.5">
              <Trash2 className="w-6 h-6 text-rose-600" />
              <h4 className="font-bold text-sm">Privacy-Focused</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Temporary in-memory sessions that are permanently erased upon host session termination.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 dark:border-brand-darkBorder bg-white dark:bg-brand-darkCard py-6 text-center text-xs text-slate-500 dark:text-slate-400 font-medium">
        <div className="max-w-6xl mx-auto px-4 space-y-1">
          <p className="font-bold text-slate-700 dark:text-slate-200">
            LiveControl — Control the room. Engage everyone.
          </p>
          <p>
            Temporary In-Memory Live Sessions
          </p>
        </div>
      </footer>
    </div>
  );
}
