'use client';

import React from 'react';
import Link from 'next/link';
import { useTheme } from './ThemeProvider';
import { Sun, Moon, Radio } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="w-full border-b border-slate-200 dark:border-brand-darkBorder bg-white/95 dark:bg-brand-darkBg/95 backdrop-blur-md sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Tagline */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-brand-primary text-white flex items-center justify-center font-bold text-base">
            LC
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                LiveControl
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                <Radio className="w-2.5 h-2.5 text-brand-secondary animate-pulse" />
                Live
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
              Authoritative Presentation & Quiz Platform
            </p>
          </div>
        </Link>

        {/* Right Navigation Controls */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/join"
            className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Join Room
          </Link>

          <Link
            href="/create"
            className="text-xs sm:text-sm font-semibold text-white bg-brand-primary hover:bg-brand-primaryDark px-3.5 py-2 rounded-xl transition-all"
          >
            Create Session
          </Link>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Dark/Light Mode"
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors"
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
