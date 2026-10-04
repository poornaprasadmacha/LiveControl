'use client';

import React from 'react';
import Link from 'next/link';
import { useTheme } from './ThemeProvider';
import { Sun, Moon, Radio, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="w-full border-b border-sky-100 dark:border-brand-darkBorder bg-white/80 dark:bg-brand-darkBg/90 backdrop-blur-md sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Tagline */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-secondary text-white flex items-center justify-center font-black text-lg shadow-md group-hover:scale-105 transition-transform">
            LC
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black text-brand-primary dark:text-white tracking-tight">
                LiveControl
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-brand-light dark:bg-brand-secondary/30 text-brand-primary dark:text-brand-light">
                <Radio className="w-2.5 h-2.5 text-brand-secondary animate-pulse" />
                Real-Time
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium -mt-1 hidden sm:block">
              Control the room. Engage everyone.
            </p>
          </div>
        </Link>

        {/* Right Navigation Controls */}
        <div className="flex items-center gap-3">
          <Link
            href="/join"
            className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-brand-primary dark:hover:text-brand-light px-3 py-2 rounded-lg hover:bg-sky-50 dark:hover:bg-brand-darkCard transition-colors"
          >
            Join Room
          </Link>

          <Link
            href="/create"
            className="text-xs sm:text-sm font-semibold text-white bg-brand-primary hover:bg-brand-primaryDark px-4 py-2 rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            Create Session
          </Link>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Dark/Light Mode"
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-sky-100 dark:hover:bg-brand-darkCard border border-sky-100 dark:border-brand-darkBorder transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-brand-primary" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
