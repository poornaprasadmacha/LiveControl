'use client';

import React, { useEffect, useState } from 'react';
import { SlideViewer } from '../presentation/SlideViewer';
import { getSlidesByTitle } from '@/lib/samplePresentation';
import { EndSessionModal } from './EndSessionModal';
import { ShareModal } from '../shared/ShareModal';
import { 
  ChevronLeft, ChevronRight, EyeOff, Maximize, Share2, Trash2, Users, 
  Sparkles, Keyboard, Smartphone
} from 'lucide-react';
import { PublicPresentationState } from '@/types';

interface PresentationAdminDashboardProps {
  state: PublicPresentationState;
  onSlideChange: (slideIndex: number, isBlank?: boolean) => void;
  onToggleBlank: () => void;
  onEndSession: () => void;
}

export const PresentationAdminDashboard: React.FC<PresentationAdminDashboardProps> = ({
  state,
  onSlideChange,
  onToggleBlank,
  onEndSession,
}) => {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isEndModalOpen, setIsEndModalOpen] = useState(false);
  const [jumpSlideInput, setJumpSlideInput] = useState('');

  const slides = getSlidesByTitle(state.title);
  const currentSlide = state.currentSlide;
  const totalSlides = slides.length;

  const handlePrev = () => {
    if (currentSlide > 1) {
      onSlideChange(currentSlide - 1);
    }
  };

  const handleNext = () => {
    if (currentSlide < totalSlides) {
      onSlideChange(currentSlide + 1);
    }
  };

  const handleJump = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(jumpSlideInput, 10);
    if (!isNaN(val) && val >= 1 && val <= totalSlides) {
      onSlideChange(val);
      setJumpSlideInput('');
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'Home') {
        e.preventDefault();
        onSlideChange(1);
      } else if (e.key === 'End') {
        e.preventDefault();
        onSlideChange(totalSlides);
      } else if (e.key === 'b' || e.key === 'B') {
        e.preventDefault();
        onToggleBlank();
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, totalSlides]);

  return (
    <div className="min-h-screen bg-brand-bgLight dark:bg-brand-darkBg text-slate-800 dark:text-slate-100 flex flex-col justify-between">
      
      {/* Top Admin Header */}
      <header className="bg-white dark:bg-brand-darkCard border-b border-slate-200 dark:border-brand-darkBorder px-4 sm:px-8 py-3 sticky top-0 z-30 flex flex-wrap items-center justify-between gap-4">
        
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-primary text-white flex items-center justify-center font-bold text-sm">
            LC
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white">
                Presentation Dashboard
              </span>
              <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border border-slate-200 dark:border-slate-700">
                {state.id}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {state.title}
            </p>
          </div>
        </div>

        {/* Status Indicators & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* LIVE status indicator */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>LIVE</span>
          </div>

          {/* Viewer Count */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-700">
            <Users className="w-3.5 h-3.5 text-brand-secondary" />
            <span>{state.viewerCount} Viewers</span>
          </div>

          {/* Share Button */}
          <button
            onClick={() => setIsShareOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>

          {/* Fullscreen button */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors"
            title="Toggle Fullscreen"
          >
            <Maximize className="w-4 h-4" />
          </button>

          {/* END & DELETE SESSION button */}
          <button
            onClick={() => setIsEndModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>End Session</span>
          </button>
        </div>
      </header>

      {/* Main Dashboard Grid */}
      <main className="max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        
        {/* Left Sidebar: Slide Deck Thumbnails */}
        <div className="lg:col-span-3 bg-white dark:bg-brand-darkCard border border-slate-200 dark:border-brand-darkBorder rounded-2xl p-4 flex flex-col max-h-[640px] overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Slide Deck ({totalSlides})
            </h3>
            <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
              {currentSlide} / {totalSlides}
            </span>
          </div>

          <div className="space-y-2 overflow-y-auto pr-1 flex-1">
            {slides.map((slide, idx) => {
              const slideNum = idx + 1;
              const isActive = slideNum === currentSlide;

              return (
                <button
                  key={slide.id}
                  onClick={() => onSlideChange(slideNum)}
                  className={`w-full text-left p-3 rounded-xl border transition-all text-xs flex items-start gap-2.5 ${
                    isActive
                      ? 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 font-bold'
                      : 'bg-white dark:bg-brand-darkCard border-slate-100 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-[10px] shrink-0 ${
                    isActive ? 'bg-brand-primary text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                    {slideNum}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={`truncate text-xs ${isActive ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-700 dark:text-slate-300'}`}>
                      {slide.title}
                    </p>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 block truncate">
                      {slide.type}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Center Area: Vertical Phone Screen Preview */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center gap-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile Vertical View (Audience Screen)</span>
          </div>

          {/* Vertical Mobile Frame */}
          <div className="w-full max-w-sm mx-auto aspect-[9/16] min-h-[540px] max-h-[640px] flex flex-col justify-center">
            <SlideViewer 
              currentSlide={currentSlide} 
              isBlank={state.isBlank}
              presentationTitle={state.title}
              slides={slides}
              className="h-full border border-slate-200 dark:border-brand-darkBorder rounded-2xl"
            />
          </div>

          {/* Quick Action Control Strip */}
          <div className="w-full max-w-sm mx-auto bg-white dark:bg-brand-darkCard border border-slate-200 dark:border-brand-darkBorder rounded-2xl p-3 flex flex-wrap items-center justify-between gap-2">
            
            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrev}
                disabled={currentSlide <= 1}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-40 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-1 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev</span>
              </button>

              <button
                onClick={handleNext}
                disabled={currentSlide >= totalSlides}
                className="px-3 py-1.5 rounded-xl bg-brand-primary hover:bg-brand-primaryDark disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1 transition-colors"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Blank Screen Toggle */}
            <button
              onClick={onToggleBlank}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                state.isBlank
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <EyeOff className="w-3.5 h-3.5" />
              <span>{state.isBlank ? 'Resume' : 'Blank'}</span>
            </button>

            {/* Jump to Slide */}
            <form onSubmit={handleJump} className="flex items-center gap-1">
              <input
                type="number"
                min="1"
                max={totalSlides}
                placeholder="#"
                value={jumpSlideInput}
                onChange={(e) => setJumpSlideInput(e.target.value)}
                className="w-11 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-center font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
              />
              <button
                type="submit"
                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
              >
                Go
              </button>
            </form>
          </div>
        </div>

        {/* Right Sidebar: Overview & Shortcuts */}
        <div className="lg:col-span-3 space-y-4">
          
          <div className="bg-white dark:bg-brand-darkCard border border-slate-200 dark:border-brand-darkBorder rounded-2xl p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-secondary" />
              <span>Session Overview</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Room Code:</span>
                <span className="font-mono font-bold text-brand-primary dark:text-slate-200">{state.id}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Active Viewers:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{state.viewerCount}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Current Slide:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{currentSlide} / {totalSlides}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Display State:</span>
                <span className={`font-bold ${state.isBlank ? 'text-amber-500' : 'text-emerald-500'}`}>
                  {state.isBlank ? 'BLANKED' : 'ACTIVE'}
                </span>
              </div>
            </div>
          </div>

          {/* Keyboard Shortcuts Card */}
          <div className="bg-white dark:bg-brand-darkCard border border-slate-200 dark:border-brand-darkBorder rounded-2xl p-4 space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Keyboard className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
              <span>Keyboard Controls</span>
            </h3>

            <div className="space-y-2 text-[11px] text-slate-600 dark:text-slate-300">
              <div className="flex justify-between">
                <span>Next Slide:</span>
                <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded font-mono font-bold">→</kbd>
              </div>
              <div className="flex justify-between">
                <span>Previous Slide:</span>
                <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded font-mono font-bold">←</kbd>
              </div>
              <div className="flex justify-between">
                <span>Blank Screen:</span>
                <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded font-mono font-bold">B</kbd>
              </div>
              <div className="flex justify-between">
                <span>Fullscreen:</span>
                <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded font-mono font-bold">F</kbd>
              </div>
              <div className="flex justify-between">
                <span>First / Last:</span>
                <span className="font-mono font-bold">Home / End</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Share Modal */}
      <ShareModal
        roomId={state.id}
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />

      {/* End Session Confirmation Modal */}
      <EndSessionModal
        isOpen={isEndModalOpen}
        isQuiz={false}
        onClose={() => setIsEndModalOpen(false)}
        onConfirmEnd={onEndSession}
      />
    </div>
  );
};
