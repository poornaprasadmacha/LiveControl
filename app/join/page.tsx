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
    <div className="min-h-screen bg-brand-bgLight dark:bg-brand-darkBg text-slate-900 dark:text-white flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-md w-full mx-auto px-4 py-12 flex flex-col justify-center">
        <div className="bg-white dark:bg-brand-darkCard border border-sky-100 dark:border-brand-darkBorder rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
          
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-brand-light/60 dark:bg-brand-secondary/20 text-brand-primary dark:text-brand-light mx-auto flex items-center justify-center">
              <LogIn className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              Join Live Session
            </h1>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Enter the unique Room ID provided by the host.
            </p>
          </div>

          <form onSubmit={handleJoin} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300">
                Room Join Code
              </label>
              <input
                type="text"
                required
                placeholder="e.g. LC-8F3K2"
                value={roomIdInput}
                onChange={(e) => setRoomIdInput(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-brand-darkBorder bg-slate-50 dark:bg-brand-darkBg text-slate-900 dark:text-white font-mono font-black text-center text-lg tracking-wider focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all uppercase"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-brand-primary hover:bg-brand-primaryDark text-white font-black text-sm rounded-2xl shadow-xl flex items-center justify-center gap-2 hover:shadow-2xl transition-all"
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
