'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/shared/Navbar';
import { 
  Play, Radio, Presentation, HelpCircle, ShieldCheck, Zap, Smartphone, 
  Share2, Lock, Trash2, ArrowRight, Sparkles 
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-brand-bgLight dark:bg-brand-darkBg text-slate-900 dark:text-white flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-24">
        
        {/* Hero Section */}
        <section className="text-center space-y-8 max-w-4xl mx-auto pt-4">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-light/60 dark:bg-brand-secondary/20 border border-brand-primary/20 text-brand-primary dark:text-brand-light text-xs sm:text-sm font-bold shadow-sm">
            <Radio className="w-4 h-4 text-brand-secondary animate-pulse" />
            <span>Real-Time Authoritative Control Engine</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
              LiveControl
            </h1>
            <p className="text-2xl sm:text-4xl font-extrabold text-brand-primary dark:text-brand-light">
              Control the room. Engage everyone.
            </p>
          </div>

          <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
            A real-time presentation and quiz platform where one administrator controls what everyone sees instantly without page refreshes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/create"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-brand-primary hover:bg-brand-primaryDark text-white font-extrabold text-base flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transition-all"
            >
              <span>Create Session</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="/join"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white dark:bg-brand-darkCard hover:bg-sky-50 dark:hover:bg-brand-darkBorder text-slate-800 dark:text-white font-extrabold text-base flex items-center justify-center gap-3 border border-sky-100 dark:border-brand-darkBorder shadow-lg transition-all"
            >
              <span>Join Session</span>
            </Link>

            <Link
              href="/demo"
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 hover:bg-teal-100 text-brand-secondary dark:text-teal-400 font-bold text-sm flex items-center justify-center gap-2 border border-teal-200 dark:border-teal-900 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Interactive Demo</span>
            </Link>
          </div>
        </section>

        {/* Two Core Modes Section */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Two Powerful Operating Modes
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
              Designed for interactive classrooms, keynotes, workshops, and corporate training.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Mode A: Live Presentation */}
            <div className="bg-white dark:bg-brand-darkCard border border-sky-100 dark:border-brand-darkBorder rounded-3xl p-8 shadow-xl space-y-6 flex flex-col justify-between hover:border-brand-primary transition-all">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-brand-light/60 dark:bg-brand-secondary/20 text-brand-primary dark:text-brand-light flex items-center justify-center">
                  <Presentation className="w-7 h-7" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-brand-primary text-white uppercase tracking-wider">
                  MODE A
                </span>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  Live Presentation
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  The administrator controls the visible slide in real time. When the host moves to Slide 5, every connected audience member immediately updates to Slide 5 without manual navigation or URL parameters.
                </p>
              </div>

              <ul className="space-y-2 text-xs font-semibold text-slate-700 dark:text-slate-300 pt-2">
                <li className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-brand-secondary" />
                  <span>Server-authoritative slide locking</span>
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-brand-secondary" />
                  <span>Blank screen toggle & instant updates</span>
                </li>
              </ul>
            </div>

            {/* Mode B: Live Quiz */}
            <div className="bg-white dark:bg-brand-darkCard border border-sky-100 dark:border-brand-darkBorder rounded-3xl p-8 shadow-xl space-y-6 flex flex-col justify-between hover:border-brand-secondary transition-all">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-brand-darkBg text-brand-secondary flex items-center justify-center">
                  <HelpCircle className="w-7 h-7" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-brand-secondary text-white uppercase tracking-wider">
                  MODE B
                </span>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  Live Quiz
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Participants join using nicknames. The host controls question progression, opens/closes answers, reveals correct responses, and displays live animated leaderboards.
                </p>
              </div>

              <ul className="space-y-2 text-xs font-semibold text-slate-700 dark:text-slate-300 pt-2">
                <li className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-brand-secondary" />
                  <span>Server-side scoring & answer validation</span>
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-brand-secondary" />
                  <span>CSV exportable results before room deletion</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Features List Section */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Built for Speed, Privacy & Simplicity
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-white dark:bg-brand-darkCard p-6 rounded-2xl border border-sky-100 dark:border-brand-darkBorder shadow-sm space-y-3">
              <ShieldCheck className="w-8 h-8 text-brand-primary" />
              <h4 className="font-extrabold text-base">No Viewer Login</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Audience members scan or click a shared link and enter immediately without accounts.
              </p>
            </div>

            <div className="bg-white dark:bg-brand-darkCard p-6 rounded-2xl border border-sky-100 dark:border-brand-darkBorder shadow-sm space-y-3">
              <Zap className="w-8 h-8 text-brand-secondary" />
              <h4 className="font-extrabold text-base">Instant Sync</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Powered by Socket.IO WebSocket connections for sub-millisecond broadcast updates.
              </p>
            </div>

            <div className="bg-white dark:bg-brand-darkCard p-6 rounded-2xl border border-sky-100 dark:border-brand-darkBorder shadow-sm space-y-3">
              <Smartphone className="w-8 h-8 text-brand-primary" />
              <h4 className="font-extrabold text-base">Mobile-Friendly</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Hosts can manage the live session seamlessly from iOS or Android smartphones.
              </p>
            </div>

            <div className="bg-white dark:bg-brand-darkCard p-6 rounded-2xl border border-sky-100 dark:border-brand-darkBorder shadow-sm space-y-3">
              <Trash2 className="w-8 h-8 text-rose-500" />
              <h4 className="font-extrabold text-base">Privacy-Focused</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                No database. Active session data lives in server memory until intentionally deleted by host.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-sky-100 dark:border-brand-darkBorder bg-white dark:bg-brand-darkCard py-8 text-center text-xs text-slate-500 dark:text-slate-400 font-medium">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-bold text-slate-700 dark:text-slate-200">
            LiveControl — Control the room. Engage everyone.
          </p>
          <p>
            Temporary In-Memory Live Sessions • Production Quality Architecture
          </p>
        </div>
      </footer>
    </div>
  );
}
