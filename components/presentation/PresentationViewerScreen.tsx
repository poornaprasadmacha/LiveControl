'use client';

import React from 'react';
import { SlideViewer } from './SlideViewer';
import { AlertCircle, Maximize } from 'lucide-react';
import { PublicPresentationState } from '@/types';

interface PresentationViewerScreenProps {
  state: PublicPresentationState;
  isConnected: boolean;
}

export const PresentationViewerScreen: React.FC<PresentationViewerScreenProps> = ({
  state,
}) => {
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div className="min-h-[100dvh] h-[100dvh] w-full bg-slate-900 sm:bg-brand-bgLight sm:dark:bg-brand-darkBg flex items-center justify-center p-0 sm:p-4 overflow-hidden select-none">
      
      {/* Discreet floating reconnecting toast if presenter temporarily disconnects */}
      {!state.adminConnected && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 px-3.5 py-1.5 rounded-full bg-amber-600/90 text-white text-xs font-medium flex items-center gap-1.5 backdrop-blur-sm border border-amber-500/30">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Presenter disconnected. Waiting for reconnection...</span>
        </div>
      )}

      {/* Subtle floating fullscreen button */}
      <button
        onClick={toggleFullscreen}
        aria-label="Toggle Fullscreen"
        className="fixed top-3 right-3 z-40 p-2 rounded-full bg-black/10 hover:bg-black/30 dark:bg-white/10 dark:hover:bg-white/20 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-all backdrop-blur-sm"
        title="Toggle Fullscreen"
      >
        <Maximize className="w-4 h-4" />
      </button>

      {/* 
        Vertical Presentation Container:
        - Full viewport on mobile phones (100dvh, edge-to-edge, vertical)
        - Centered vertical phone card frame on desktop and tablets
        - Zero header and zero footer for viewers
      */}
      <div className="w-full h-full sm:h-[94dvh] sm:max-w-md sm:aspect-[9/16] flex flex-col justify-center">
        <SlideViewer
          currentSlide={state.currentSlide}
          isBlank={state.isBlank}
          presentationTitle={state.title}
          className="h-full rounded-none sm:rounded-2xl border-0 sm:border border-slate-200/90 dark:border-brand-darkBorder"
        />
      </div>
    </div>
  );
};
