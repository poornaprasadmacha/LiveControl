'use client';

import React, { useEffect, useState } from 'react';
import { SlideViewer } from '../presentation/SlideViewer';
import { getSlidesByTitle } from '@/lib/samplePresentation';
import { EndSessionModal } from './EndSessionModal';
import { ShareModal } from '../shared/ShareModal';
import { 
  ChevronLeft, ChevronRight, EyeOff, Maximize, Share2, Trash2, Users, 
  Layers, X, Smartphone
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
  const [isDesktopDeckOpen, setIsDesktopDeckOpen] = useState(false);

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

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Keyboard navigation
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
    <div className="min-h-[100dvh] h-[100dvh] w-full bg-slate-100 flex flex-col justify-between overflow-hidden select-none font-sans relative">
      
      {/* 
        Top Admin Header:
        - HIDDEN ON MOBILE (phones) to maximize 100% vertical screen space
        - Shown only on tablet/desktop (sm:flex) as an elegant iOS status strip
      */}
      <header className="hidden sm:flex bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 py-3 items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-extrabold text-xs">
            LC
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-slate-900">
                Host Studio
              </span>
              <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-bold border border-slate-300">
                {state.id}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium truncate max-w-xs">
              {state.title}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Live broadcast pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>LIVE</span>
          </div>

          {/* Active Viewers Count */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200">
            <Users className="w-3.5 h-3.5 text-emerald-700" />
            <span>{state.viewerCount} Viewers</span>
          </div>

          {/* Toggle Deck Drawer on Desktop */}
          <button
            onClick={() => setIsDesktopDeckOpen(!isDesktopDeckOpen)}
            className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 border border-slate-300 transition-all"
          >
            <Layers className="w-3.5 h-3.5 text-slate-700" />
            <span>Deck ({totalSlides})</span>
          </button>

          {/* Share */}
          <button
            onClick={() => setIsShareOpen(true)}
            className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-300 transition-all"
            title="Share Room Link"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-300 transition-all"
            title="Toggle Fullscreen"
          >
            <Maximize className="w-4 h-4" />
          </button>

          {/* End Session */}
          <button
            onClick={() => setIsEndModalOpen(true)}
            className="px-3.5 py-1.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>End</span>
          </button>
        </div>
      </header>

      {/* 
        Main Admin Viewing Area:
        - Admin sees the slide JUST AS USER
        - On Mobile: Edge-to-edge full height (100dvh), zero header/deck clutter
        - On Desktop: Centered vertical phone card frame
      */}
      <main className="flex-1 w-full flex items-center justify-center relative p-0 sm:p-4 overflow-hidden">
        
        {/* The Exact User Vertical Slide View */}
        <div className="w-full h-full sm:h-[94dvh] sm:max-w-md sm:aspect-[9/16] flex flex-col justify-center relative">
          <SlideViewer 
            currentSlide={currentSlide} 
            isBlank={state.isBlank}
            presentationTitle={state.title}
            slides={slides}
            className="h-full rounded-none sm:rounded-3xl border-0 sm:border border-slate-200"
          />
        </div>

        {/* 
          iOS Left Floating Navigation Chevron:
          - High touch area on the left edge for single-thumb backward navigation
        */}
        <button
          onClick={handlePrev}
          disabled={currentSlide <= 1}
          aria-label="Previous Slide"
          className={`fixed left-2 sm:left-6 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-white/90 hover:bg-white text-slate-800 border border-slate-200/90 backdrop-blur-md flex items-center justify-center active:scale-90 transition-all ${
            currentSlide <= 1 ? 'opacity-30 pointer-events-none' : 'hover:border-slate-400'
          }`}
          title="Previous Slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* 
          iOS Right Floating Navigation Chevron:
          - High touch area on the right edge for single-thumb forward navigation
        */}
        <button
          onClick={handleNext}
          disabled={currentSlide >= totalSlides}
          aria-label="Next Slide"
          className={`fixed right-2 sm:right-6 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-slate-900/90 hover:bg-slate-950 text-white border border-slate-800 backdrop-blur-md flex items-center justify-center active:scale-90 transition-all ${
            currentSlide >= totalSlides ? 'opacity-30 pointer-events-none' : 'hover:bg-black'
          }`}
          title="Next Slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* 
          iOS Bottom Dynamic Island Pill (Admin Control Bar):
          - Minimal, floating at bottom center of the screen
          - Displays current slide index (e.g. 12 / 32)
          - Quick Blank toggle
          - Quick Share & Exit buttons
          - Completely non-intrusive and leaves slides unobstructed
        */}
        <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 bg-white/95 backdrop-blur-lg border border-slate-200/90 rounded-full px-4 py-2 flex items-center gap-3">
          
          {/* Slide Indicator Badge */}
          <div className="flex items-center gap-1 font-mono text-xs font-extrabold text-slate-800 px-2 py-0.5 rounded-full bg-slate-100">
            <span>{currentSlide}</span>
            <span className="text-slate-400">/</span>
            <span>{totalSlides}</span>
          </div>

          <div className="h-4 w-px bg-slate-200" />

          {/* Quick Blank Screen Toggle */}
          <button
            onClick={onToggleBlank}
            className={`p-1.5 rounded-full text-xs font-bold flex items-center gap-1 transition-all ${
              state.isBlank
                ? 'bg-amber-600 text-white px-2.5'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
            }`}
            title={state.isBlank ? 'Resume Screen' : 'Blank Screen'}
          >
            <EyeOff className="w-4 h-4" />
            {state.isBlank && <span className="text-[11px] font-bold">Blanked</span>}
          </button>

          {/* Quick Share on Mobile */}
          <button
            onClick={() => setIsShareOpen(true)}
            className="p-1.5 rounded-full text-slate-600 hover:text-slate-950 hover:bg-slate-100 transition-colors sm:hidden"
            title="Share Room"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Quick End on Mobile */}
          <button
            onClick={() => setIsEndModalOpen(true)}
            className="p-1.5 rounded-full text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors sm:hidden"
            title="End Session"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </main>

      {/* 
        Optional Desktop Slide Deck Drawer:
        - Only shown on desktop when host explicitly toggles "Deck"
        - Hidden on mobile per user specification
      */}
      {isDesktopDeckOpen && (
        <aside className="hidden sm:flex fixed right-4 top-16 bottom-4 z-50 w-80 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-3xl p-4 flex-col overflow-hidden animate-in fade-in slide-in-from-right duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-900" />
              <span>Slide Deck Navigator</span>
            </h3>
            <button
              onClick={() => setIsDesktopDeckOpen(false)}
              className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2 overflow-y-auto flex-1 pr-1">
            {slides.map((slide, idx) => {
              const slideNum = idx + 1;
              const isActive = slideNum === currentSlide;

              return (
                <button
                  key={slide.id}
                  onClick={() => {
                    onSlideChange(slideNum);
                    setIsDesktopDeckOpen(false);
                  }}
                  className={`w-full text-left p-3 rounded-2xl border transition-all text-xs flex items-start gap-2.5 ${
                    isActive
                      ? 'bg-blue-50 border-blue-600 text-blue-950 font-extrabold'
                      : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-[10px] shrink-0 ${
                    isActive ? 'bg-blue-900 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {slideNum}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold">
                      {slide.title}
                    </p>
                    <span className="text-[10px] text-slate-400 block truncate mt-0.5">
                      {slide.badge || slide.type}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>
      )}

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
