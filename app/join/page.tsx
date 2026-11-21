'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/shared/Navbar';
import { LogIn, ArrowRight } from 'lucide-react';

export default function JoinSessionPage() {
  const router = useRouter();
  const [roomIdInput, setRoomIdInput] = useState('');

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    let cleaned = roomIdInput.trim().toUpperCase();
    if (!cleaned) return;
    if (!cleaned.startsWith('LC-') && cleaned.length === 5) {
      cleaned = `LC-${cleaned}`;
    }
    router.push(`/room/${cleaned}`);
  };

  return (
    <div className="min-h-screen bg-brand-bgLight dark:bg-brand-darkBg text-slate-800 dark:text-slate-100 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-md w-full mx-auto px-4 py-12 flex flex-col justify-center">
        <div className="bg-white dark:bg-brand-darkCard border border-slate-200 dark:border-brand-darkBorder rounded-2xl p-6 sm:p-8 space-y-6">
          
          <div className="text-center space-y-1.5">
            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 mx-auto flex items-center justify-center border border-slate-200 dark:border-slate-700">
              <LogIn className="w-6 h-6 text-brand-primary dark:text-slate-200" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Join Live Session
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Enter the unique Room ID provided by the host.
            </p>
          </div>

          <form onSubmit={handleJoin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Room Join Code
              </label>
              <input
                type="text"
                required
                placeholder="e.g. LC-8F3K2"
                value={roomIdInput}
                onChange={(e) => setRoomIdInput(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono font-bold text-center text-lg tracking-wider focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all uppercase"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-brand-primary hover:bg-brand-primaryDark text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              <span>Join Live Room</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
