'use client';

import React from 'react';
import { SlideViewer } from './SlideViewer';
import { Maximize, Radio } from 'lucide-react';
import { PublicPresentationState } from '@/types';
import { VoiceControl } from '../shared/VoiceControl';

interface PresentationViewerScreenProps {
  state: PublicPresentationState;
  isConnected: boolean;
}

export const PresentationViewerScreen: React.FC<PresentationViewerScreenProps> = ({
  state,
  isConnected,
}) => {
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div className="min-h-screen bg-brand-bgLight dark:bg-brand-darkBg text-slate-900 dark:text-white flex flex-col justify-between overflow-x-hidden">
      
      {/* Viewer Header */}
      <header className="bg-white/90 dark:bg-brand-darkCard/90 backdrop-blur-md border-b border-sky-100 dark:border-brand-darkBorder px-4 sm:px-8 py-3 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-primary text-white flex items-center justify-center font-black text-sm shadow-md">
            LC
          </div>
          <div>
            <h1 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-md">
              {state.title}
            </h1>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block">
              Room: <strong className="text-brand-primary dark:text-brand-light font-mono">{state.id}</strong>
            </span>
          </div>
        </div>

        {/* Status Indicators & Voice Control */}
        <div className="flex items-center gap-3">
          
          <VoiceControl roomId={state.id} role="VIEWER" />
          
          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-sky-50 dark:bg-brand-darkBg text-brand-primary dark:text-brand-light border border-sky-100 dark:border-brand-darkBorder">
            <Radio className="w-3.5 h-3.5 text-brand-secondary animate-pulse" />
            <span>Synced Live</span>
          </div>

          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-brand-darkBg dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-brand-darkBorder transition-colors"
            title="Fullscreen Mode"
          >
            <Maximize className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Disconnect Alert if Presenter Disconnected */}
      {!state.adminConnected && (
        <div className="bg-amber-500 text-white text-xs font-bold py-2 px-4 text-center animate-pulse">
          ⚠️ Presenter temporarily disconnected. Please wait...
        </div>
      )}

      {/* Main Presentation Slide View */}
      <main className="max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex-1 flex flex-col justify-center my-auto">
        <div className="w-full relative shadow-2xl rounded-2xl overflow-hidden">
          <SlideViewer currentSlide={state.currentSlide} isBlank={state.isBlank} />
        </div>
      </main>

      <footer className="text-center py-3 text-[11px] text-slate-400 font-medium">
        LiveControl Server-Authoritative Session • Room {state.id}
      </footer>
    </div>
  );
};
