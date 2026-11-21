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
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col justify-between font-sans">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-20">
        
        {/* Hero Section */}
        <section className="text-center space-y-6 max-w-3xl mx-auto pt-2">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-800 text-xs sm:text-sm font-bold">
            <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
            <span>Server-Authoritative Control Engine</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
              LiveControl
            </h1>
            <p className="text-xl sm:text-3xl font-extrabold text-blue-900">
              Control the room. Engage everyone.
            </p>
          </div>

          <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
            Real-time presentation and quiz platform where one administrator controls what everyone sees instantly with zero page reloads.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-3">
            <Link
              href="/create"
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-extrabold text-base flex items-center justify-center gap-2.5 transition-all"
            >
              <span>Create Session</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="/join"
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-white hover:bg-slate-50 text-slate-900 font-extrabold text-base flex items-center justify-center gap-2 border border-slate-300 transition-all"
            >
              <span>Join Session</span>
            </Link>

            <Link
              href="/demo"
              className="w-full sm:w-auto px-6 py-4 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm flex items-center justify-center gap-2 border border-slate-300 transition-all"
            >
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span>Interactive Simulator</span>
            </Link>
          </div>
        </section>

        {/* Two Core Modes Section */}
        <section className="space-y-6">
          <div className="text-center space-y-1.5">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Two Core Operating Modes
            </h2>
            <p className="text-sm font-semibold text-slate-600">
              Engineered for keynotes, Bible study sessions, and interactive classrooms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Mode A: Live Presentation */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-900 flex items-center justify-center border border-blue-200">
                  <Presentation className="w-7 h-7" />
                </div>
                <span className="px-3 py-1 rounded-md text-xs font-extrabold bg-blue-100 text-blue-900 uppercase tracking-wider">
                  Mode A
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900">
                  Live Vertical Presentation
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
                  The host controls the current slide in real time. Optimized with a vertical layout tailored for mobile devices with zero header and footer clutter for viewers.
                </p>
              </div>

              <ul className="space-y-2.5 text-sm font-semibold text-slate-700 pt-3 border-t border-slate-100">
                <li className="flex items-center gap-2.5">
                  <Zap className="w-4 h-4 text-emerald-700" />
                  <span>Server-authoritative slide synchronization</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Zap className="w-4 h-4 text-emerald-700" />
                  <span>Instant blank screen toggle and mobile responsiveness</span>
                </li>
              </ul>
            </div>

            {/* Mode B: Live Quiz */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-200">
                  <HelpCircle className="w-7 h-7" />
                </div>
                <span className="px-3 py-1 rounded-md text-xs font-extrabold bg-emerald-100 text-emerald-900 uppercase tracking-wider">
                  Mode B
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900">
                  Live Interactive Quiz
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
                  Audience members join using nicknames. The host manages question pacing, opens and closes responses, reveals solutions, and triggers live leaderboards.
                </p>
              </div>

              <ul className="space-y-2.5 text-sm font-semibold text-slate-700 pt-3 border-t border-slate-100">
                <li className="flex items-center gap-2.5">
                  <Zap className="w-4 h-4 text-emerald-700" />
                  <span>Server-side scoring & answer validation</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Zap className="w-4 h-4 text-emerald-700" />
                  <span>Exportable CSV results before memory erasure</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-extrabold text-slate-900">
              Built for Performance and Simplicity
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-2.5">
              <ShieldCheck className="w-7 h-7 text-blue-900" />
              <h4 className="font-extrabold text-base">No Viewer Accounts</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                Audience members scan or click a link and participate instantly without registration.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-2.5">
              <Zap className="w-7 h-7 text-emerald-700" />
              <h4 className="font-extrabold text-base">Instant Sync</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                Powered by Socket.IO WebSocket connections for sub-millisecond real-time sync.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-2.5">
              <Smartphone className="w-7 h-7 text-blue-900" />
              <h4 className="font-extrabold text-base">Vertical & Mobile-First</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                Vertical presentation layout optimized for phone screens and handheld viewing.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-2.5">
              <Trash2 className="w-7 h-7 text-rose-600" />
              <h4 className="font-extrabold text-base">Privacy-Focused</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                Temporary in-memory sessions that are permanently erased upon host session termination.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs sm:text-sm text-slate-600 font-semibold">
        <div className="max-w-6xl mx-auto px-4 space-y-1">
          <p className="font-extrabold text-slate-800">
            LiveControl — Control the room. Engage everyone.
          </p>
          <p className="text-slate-500 font-medium">
            Temporary In-Memory Live Sessions
          </p>
        </div>
      </footer>
    </div>
  );
}
