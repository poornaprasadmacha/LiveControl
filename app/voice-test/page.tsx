'use client';

import React from 'react';
import { Navbar } from '@/components/shared/Navbar';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export default function VoiceTestPage() {
  return (
    <div className="min-h-screen bg-brand-bgLight dark:bg-brand-darkBg text-slate-800 dark:text-slate-100 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-xl w-full mx-auto px-4 py-12 flex flex-col justify-center">
        <div className="bg-white dark:bg-brand-darkCard border border-slate-200 dark:border-brand-darkBorder rounded-2xl p-7 space-y-5 text-center">
          <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 mx-auto flex items-center justify-center border border-slate-200 dark:border-slate-700">
            <ShieldCheck className="w-6 h-6 text-brand-secondary" />
          </div>
          <div className="space-y-1.5">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Audio System Status
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Microphone and speaker systems have been removed. LiveControl runs entirely on streamlined visual synchronization.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-block px-5 py-2.5 bg-brand-primary text-white text-xs font-bold rounded-xl hover:bg-brand-primaryDark transition-all"
            >
              Return to Home Page
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
