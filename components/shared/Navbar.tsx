'use client';

import React from 'react';
import Link from 'next/link';
import { Radio } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <header className="w-full border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-50 transition-colors font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Tagline */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-blue-900 text-white flex items-center justify-center font-extrabold text-base tracking-wider">
            LC
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-extrabold text-slate-900 tracking-tight">
                LiveControl
              </span>
              <span className="inline-flex items-center gap-1.5 text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300">
                <Radio className="w-2.5 h-2.5 text-emerald-600 animate-pulse" />
                Live
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium hidden sm:block">
              Server-Authoritative Presentation & Quiz Platform
            </p>
          </div>
        </Link>

        {/* Right Navigation Controls */}
        <div className="flex items-center gap-3">
          <Link
            href="/join"
            className="text-xs sm:text-sm font-bold text-slate-700 hover:text-slate-950 px-3.5 py-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            Join Room
          </Link>

          <Link
            href="/create"
            className="text-xs sm:text-sm font-extrabold text-white bg-blue-900 hover:bg-blue-800 px-4 py-2 rounded-xl transition-all"
          >
            Create Session
          </Link>
        </div>
      </div>
    </header>
  );
};
