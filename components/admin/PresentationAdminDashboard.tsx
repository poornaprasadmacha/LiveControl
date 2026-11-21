'use client';

import React, { useEffect, useState } from 'react';
import { SlideViewer } from '../presentation/SlideViewer';
import { getSlidesByTitle } from '@/lib/samplePresentation';
import { EndSessionModal } from './EndSessionModal';
import { ShareModal } from '../shared/ShareModal';
import { 
  ChevronLeft, ChevronRight, EyeOff, Maximize, Share2, Trash2, Users, 
  Sparkles, Keyboard, Smartphone, Layers
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
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col justify-between font-sans">
      
      {/* Top Professional Admin Header */}
      <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5 sticky top-0 z-30 flex flex-wrap items-center justify-between gap-4">
        
        {/* Brand & Room Info */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-900 text-white flex items-center justify-center font-extrabold text-sm tracking-wider">
            LC
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900">
                LiveControl Studio
              </span>
              <span className="font-mono text-xs sm:text-sm px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-800 font-bold border border-slate-300">
                {state.id}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 font-semibold truncate max-w-xs sm:max-w-md">
              {state.title}
            </p>
          </div>
        </div>

        {/* Status Indicators & Control Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* LIVE status badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
            <span>LIVE BROADCAST</span>
          </div>

          {/* Active Viewers Count */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs sm:text-sm font-bold border border-slate-200">
            <Users className="w-4 h-4 text-emerald-700" />
            <span>{state.viewerCount} Viewers Connected</span>
          </div>

          {/* Share Button */}
          <button
            onClick={() => setIsShareOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold flex items-center gap-2 border border-slate-300 transition-all"
          >
            <Share2 className="w-4 h-4 text-blue-900" />
            <span>Share Room</span>
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950 text-sm font-bold border border-slate-300 transition-colors"
            title="Toggle Fullscreen"
          >
            <Maximize className="w-4 h-4" />
          </button>

          {/* End Session Button */}
          <button
            onClick={() => setIsEndModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            <span>End Session</span>
          </button>
        </div>
      </header>

      {/* Main Studio Grid */}
      <main className="max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        
        {/* Left Sidebar: Slide Deck Navigator with Extra Size */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col max-h-[720px] overflow-hidden">
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-200 mb-3.5">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-900" />
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-700">
                Slide Deck ({totalSlides})
              </h3>
            </div>
            <span className="text-sm font-mono font-extrabold text-blue-900 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
              Slide {currentSlide} of {totalSlides}
            </span>
          </div>

          <div className="space-y-2.5 overflow-y-auto pr-1 flex-1">
            {slides.map((slide, idx) => {
              const slideNum = idx + 1;
              const isActive = slideNum === currentSlide;

              return (
                <button
                  key={slide.id}
                  onClick={() => onSlideChange(slideNum)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all text-sm flex items-start gap-3 ${
                    isActive
                      ? 'bg-blue-50 border-blue-600 text-blue-950 font-bold ring-1 ring-blue-500'
                      : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                    isActive ? 'bg-blue-900 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {slideNum}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={`truncate text-sm ${isActive ? 'text-blue-950 font-extrabold' : 'text-slate-800 font-semibold'}`}>
                      {slide.title}
                    </p>
                    <span className="text-xs text-slate-500 block truncate mt-0.5">
                      {slide.badge || slide.type}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Center Area: Vertical Phone Screen Preview with Clear Controls */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center gap-4">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 font-bold uppercase tracking-wider">
            <Smartphone className="w-4 h-4 text-blue-900" />
            <span>Mobile Audience Live View (Vertical)</span>
          </div>

          {/* Vertical Mobile Frame */}
          <div className="w-full max-w-sm mx-auto aspect-[9/16] min-h-[560px] max-h-[660px] flex flex-col justify-center">
            <SlideViewer 
              currentSlide={currentSlide} 
              isBlank={state.isBlank}
              presentationTitle={state.title}
              slides={slides}
              className="h-full border border-slate-200 rounded-2xl"
            />
          </div>

          {/* Quick Action Control Strip with Extra Size */}
          <div className="w-full max-w-sm mx-auto bg-white border border-slate-200 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-2.5">
            
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={currentSlide <= 1}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-800 font-bold text-sm flex items-center gap-1.5 transition-colors border border-slate-300"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev</span>
              </button>

              <button
                onClick={handleNext}
                disabled={currentSlide >= totalSlides}
                className="px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 disabled:opacity-40 text-white font-extrabold text-sm flex items-center gap-1.5 transition-colors"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Blank Screen Toggle */}
            <button
              onClick={onToggleBlank}
              className={`px-3.5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-1.5 transition-all ${
                state.isBlank
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
              }`}
            >
              <EyeOff className="w-4 h-4" />
              <span>{state.isBlank ? 'Resume' : 'Blank'}</span>
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
                className="w-14 px-2 py-2 rounded-xl border border-slate-300 bg-slate-50 text-sm text-center font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
              />
              <button
                type="submit"
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-sm rounded-xl transition-colors border border-slate-300"
              >
                Go
              </button>
            </form>
          </div>
        </div>

        {/* Right Sidebar: Overview & Shortcuts */}
        <div className="lg:col-span-3 space-y-4">
          
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span>Session Overview</span>
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Room ID:</span>
                <span className="font-mono font-bold text-blue-900">{state.id}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Active Viewers:</span>
                <span className="font-extrabold text-slate-900">{state.viewerCount}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Current Slide:</span>
                <span className="font-extrabold text-slate-900">{currentSlide} / {totalSlides}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Screen State:</span>
                <span className={`font-extrabold ${state.isBlank ? 'text-amber-600' : 'text-emerald-700'}`}>
                  {state.isBlank ? 'BLANKED' : 'BROADCASTING'}
                </span>
              </div>
            </div>
          </div>

          {/* Keyboard Shortcuts Card with Extra Size */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Keyboard className="w-4 h-4 text-blue-900" />
              <span>Keyboard Controls</span>
            </h3>

            <div className="space-y-2.5 text-xs sm:text-sm text-slate-700 font-medium">
              <div className="flex justify-between items-center">
                <span>Next Slide:</span>
                <kbd className="px-2 py-1 bg-slate-100 border border-slate-300 rounded-md font-mono font-bold">→</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span>Previous Slide:</span>
                <kbd className="px-2 py-1 bg-slate-100 border border-slate-300 rounded-md font-mono font-bold">←</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span>Blank Screen:</span>
                <kbd className="px-2 py-1 bg-slate-100 border border-slate-300 rounded-md font-mono font-bold">B</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span>Fullscreen:</span>
                <kbd className="px-2 py-1 bg-slate-100 border border-slate-300 rounded-md font-mono font-bold">F</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span>First / Last Slide:</span>
                <span className="font-mono font-bold text-xs">Home / End</span>
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
