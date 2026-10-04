'use client';

import React, { useEffect, useState } from 'react';
import { SlideViewer } from '../presentation/SlideViewer';
import { SAMPLE_SLIDES } from '@/lib/samplePresentation';
import { EndSessionModal } from './EndSessionModal';
import { ShareModal } from '../shared/ShareModal';
import { VoiceControl } from '../shared/VoiceControl';
import { 
  ChevronLeft, ChevronRight, EyeOff, Maximize, Share2, Trash2, Users, 
  Play, RotateCcw, Keyboard, CheckCircle, Radio, Sparkles
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

  const currentSlide = state.currentSlide;
  const totalSlides = SAMPLE_SLIDES.length;

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

  // Requirement 24: Admin Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture when typing in inputs
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
    <div className="min-h-screen bg-slate-100 dark:bg-brand-darkBg text-slate-900 dark:text-white flex flex-col justify-between">
      
      {/* Top Admin Header */}
      <header className="bg-white dark:bg-brand-darkCard border-b border-sky-100 dark:border-brand-darkBorder px-4 sm:px-8 py-3 sticky top-0 z-30 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-brand-primary text-white flex items-center justify-center font-black text-base shadow-md">
            LC
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                Presentation Dashboard
              </span>
              <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-sky-100 dark:bg-brand-darkBg text-brand-primary dark:text-brand-light font-bold">
                {state.id}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {state.title}
            </p>
          </div>
        </div>

        {/* Status Indicators & Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Requirement 64: LIVE status indicator */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>🟢 LIVE</span>
          </div>

          {/* Requirement 26: Viewer Count */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 dark:bg-brand-darkBg text-slate-700 dark:text-slate-200 text-xs font-bold border border-sky-100 dark:border-brand-darkBorder">
            <Users className="w-4 h-4 text-brand-secondary" />
            <span>👥 {state.viewerCount} Viewers</span>
          </div>

          {/* Real-time Voice Share Widget */}
          <VoiceControl roomId={state.id} role="ADMIN" />

          {/* Requirement 13: Share Button */}
          <button
            onClick={() => setIsShareOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-brand-secondary hover:bg-brand-secondaryDark text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>🔗 Share</span>
          </button>

          {/* Fullscreen button */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-brand-darkBg dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-brand-darkBorder transition-colors"
            title="Toggle Fullscreen"
          >
            <Maximize className="w-4 h-4" />
          </button>

          {/* Requirement 4: Highly visible END & DELETE SESSION button */}
          <button
            onClick={() => setIsEndModalOpen(true)}
            className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all"
          >
            <Trash2 className="w-4 h-4" />
            <span>END & DELETE SESSION</span>
          </button>
        </div>
      </header>

      {/* Main Dashboard Grid */}
      <main className="max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        
        {/* Left Sidebar: Slide Thumbnails */}
        <div className="lg:col-span-3 bg-white dark:bg-brand-darkCard border border-sky-100 dark:border-brand-darkBorder rounded-2xl p-4 shadow-sm flex flex-col max-h-[600px] overflow-hidden">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center justify-between">
            <span>Slide Deck ({totalSlides})</span>
            <span className="text-brand-primary dark:text-brand-light font-mono">Slide {currentSlide}</span>
          </h3>

          <div className="space-y-2.5 overflow-y-auto pr-1 flex-1">
            {SAMPLE_SLIDES.map((slide, idx) => {
              const slideNum = idx + 1;
              const isActive = slideNum === currentSlide;

              return (
                <button
                  key={slide.id}
                  onClick={() => onSlideChange(slideNum)}
                  className={`w-full text-left p-3 rounded-xl border transition-all text-xs flex items-start gap-3 ${
                    isActive
                      ? 'bg-sky-50 dark:bg-brand-darkBg border-brand-primary dark:border-brand-light shadow-sm ring-1 ring-brand-primary'
                      : 'bg-white dark:bg-brand-darkBg/50 border-slate-100 dark:border-brand-darkBorder hover:border-sky-300 dark:hover:border-slate-700'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-[10px] shrink-0 ${
                    isActive ? 'bg-brand-primary text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                    {slideNum}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={`font-bold truncate ${isActive ? 'text-brand-primary dark:text-brand-light' : 'text-slate-800 dark:text-slate-200'}`}>
                      {slide.title}
                    </p>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">
                      {slide.type}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Center Area: Large Current Slide Preview */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center gap-4">
          <div className="w-full relative shadow-2xl rounded-2xl overflow-hidden">
            <SlideViewer currentSlide={currentSlide} isBlank={state.isBlank} />
          </div>

          {/* Quick Action Control Strip */}
          <div className="w-full bg-white dark:bg-brand-darkCard border border-sky-100 dark:border-brand-darkBorder rounded-2xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
            
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={currentSlide <= 1}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-brand-darkBg dark:hover:bg-slate-800 disabled:opacity-40 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-1 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <button
                onClick={handleNext}
                disabled={currentSlide >= totalSlides}
                className="px-4 py-2 rounded-xl bg-brand-primary hover:bg-brand-primaryDark disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1 shadow-md transition-colors"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Blank Screen Toggle Button */}
            <button
              onClick={onToggleBlank}
              className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
                state.isBlank
                  ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-md'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-brand-darkBg text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-brand-darkBorder'
              }`}
            >
              <EyeOff className="w-4 h-4" />
              <span>{state.isBlank ? 'Resume Screen' : 'Blank Screen'}</span>
            </button>

            {/* Jump to Slide Form */}
            <form onSubmit={handleJump} className="flex items-center gap-1.5">
              <input
                type="number"
                min="1"
                max={totalSlides}
                placeholder="#"
                value={jumpSlideInput}
                onChange={(e) => setJumpSlideInput(e.target.value)}
                className="w-14 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-brand-darkBorder bg-slate-50 dark:bg-brand-darkBg text-xs text-center font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-sky-100 dark:bg-brand-darkBg text-brand-primary dark:text-brand-light font-bold text-xs rounded-lg hover:bg-sky-200 transition-colors"
              >
                Go
              </button>
            </form>
          </div>
        </div>

        {/* Right Sidebar: Session Info & Keyboard Shortcuts */}
        <div className="lg:col-span-3 space-y-4">
          
          <div className="bg-white dark:bg-brand-darkCard border border-sky-100 dark:border-brand-darkBorder rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-secondary" />
              <span>Session Overview</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-brand-darkBorder">
                <span className="text-slate-500">Room ID:</span>
                <span className="font-mono font-bold text-brand-primary dark:text-brand-light">{state.id}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-brand-darkBorder">
                <span className="text-slate-500">Active Viewers:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{state.viewerCount}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-brand-darkBorder">
                <span className="text-slate-500">Current Slide:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{currentSlide} / {totalSlides}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-brand-darkBorder">
                <span className="text-slate-500">Display State:</span>
                <span className={`font-bold ${state.isBlank ? 'text-amber-500' : 'text-emerald-500'}`}>
                  {state.isBlank ? 'BLANKED' : 'ACTIVE'}
                </span>
              </div>
            </div>
          </div>

          {/* Keyboard Shortcuts Card */}
          <div className="bg-white dark:bg-brand-darkCard border border-sky-100 dark:border-brand-darkBorder rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Keyboard className="w-4 h-4 text-brand-primary" />
              <span>Keyboard Shortcuts</span>
            </h3>

            <div className="space-y-2 text-[11px] text-slate-600 dark:text-slate-300">
              <div className="flex justify-between">
                <span>Next Slide:</span>
                <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-brand-darkBg border rounded font-mono font-bold">→</kbd>
              </div>
              <div className="flex justify-between">
                <span>Previous Slide:</span>
                <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-brand-darkBg border rounded font-mono font-bold">←</kbd>
              </div>
              <div className="flex justify-between">
                <span>Blank Screen:</span>
                <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-brand-darkBg border rounded font-mono font-bold">B</kbd>
              </div>
              <div className="flex justify-between">
                <span>Fullscreen:</span>
                <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-brand-darkBg border rounded font-mono font-bold">F</kbd>
              </div>
              <div className="flex justify-between">
                <span>First / Last Slide:</span>
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
