'use client';

import React from 'react';
import { SlideViewer } from './SlideViewer';
import { PublicPresentationState } from '@/types';

interface PresentationViewerScreenProps {
  state: PublicPresentationState;
  isConnected: boolean;
}

export const PresentationViewerScreen: React.FC<PresentationViewerScreenProps> = ({
  state,
}) => {
  return (
    <div className="min-h-[100dvh] h-[100dvh] w-full bg-slate-100 flex items-center justify-center p-0 sm:p-4 overflow-hidden select-none font-sans">
      {/* 
        Pure Immersive Vertical Presentation:
        - Zero header and zero footer
        - Zero alerts or notifications (no "Admin left", "Waiting for Admin", "fullscreen" notices)
        - Seamless full-height vertical slide on mobile
      */}
      <div className="w-full h-full sm:h-[94dvh] sm:max-w-md sm:aspect-[9/16] flex flex-col justify-center">
        <SlideViewer
          currentSlide={state.currentSlide}
          isBlank={state.isBlank}
          presentationTitle={state.title}
          className="h-full rounded-none sm:rounded-3xl border-0 sm:border border-slate-200"
        />
      </div>
    </div>
  );
};
