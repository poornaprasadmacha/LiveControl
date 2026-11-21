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
    <div className="min-h-[100dvh] h-[100dvh] w-full bg-slate-100 flex items-center justify-center p-0 sm:p-4 overflow-hidden select-none font-sans">
      
      {/* Floating alert if presenter temporarily disconnects */}
      {!state.adminConnected && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-amber-500 text-white text-xs sm:text-sm font-bold flex items-center gap-2 border border-amber-600/20">
          <AlertCircle className="w-4 h-4" />
          <span>Presenter disconnected. Waiting for reconnection...</span>
        </div>
      )}

      {/* Floating fullscreen button */}
      <button
        onClick={toggleFullscreen}
        aria-label="Toggle Fullscreen"
        className="fixed top-3 right-3 z-40 p-2.5 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-slate-950 border border-slate-200 transition-all"
        title="Toggle Fullscreen"
      >
        <Maximize className="w-4 h-4" />
      </button>

      {/* 
        Vertical Presentation Container:
        - Full viewport on mobile phones (100dvh, edge-to-edge, vertical)
        - Centered vertical phone card frame on desktop and tablets
        - Zero header and zero footer for viewers
        - Pure Daylight aesthetic
      */}
      <div className="w-full h-full sm:h-[94dvh] sm:max-w-md sm:aspect-[9/16] flex flex-col justify-center">
        <SlideViewer
          currentSlide={state.currentSlide}
          isBlank={state.isBlank}
          presentationTitle={state.title}
          className="h-full rounded-none sm:rounded-2xl border-0 sm:border border-slate-200"
        />
      </div>
    </div>
  );
};
