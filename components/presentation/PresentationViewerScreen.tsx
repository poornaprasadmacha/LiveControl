'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { SlideViewer } from './SlideViewer';
import { PublicPresentationState } from '@/types';
import { Maximize, Minimize } from 'lucide-react';

interface PresentationViewerScreenProps {
  state: PublicPresentationState;
  isConnected: boolean;
}

export const PresentationViewerScreen: React.FC<PresentationViewerScreenProps> = ({
  state,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasPromptBeenDismissed, setHasPromptBeenDismissed] = useState(false);

  // Cross-browser Fullscreen helper
  const enterFullscreen = useCallback(() => {
    const docEl = document.documentElement as any;
    if (docEl.requestFullscreen) {
      docEl.requestFullscreen().catch(() => {});
    } else if (docEl.webkitRequestFullscreen) {
      docEl.webkitRequestFullscreen().catch(() => {});
    } else if (docEl.mozRequestFullScreen) {
      docEl.mozRequestFullScreen().catch(() => {});
    } else if (docEl.msRequestFullscreen) {
      docEl.msRequestFullscreen().catch(() => {});
    }
    setHasPromptBeenDismissed(true);
  }, []);

  const exitFullscreen = useCallback(() => {
    const doc = document as any;
    if (doc.exitFullscreen) {
      doc.exitFullscreen().catch(() => {});
    } else if (doc.webkitExitFullscreen) {
      doc.webkitExitFullscreen().catch(() => {});
    } else if (doc.mozCancelFullScreen) {
      doc.mozCancelFullScreen().catch(() => {});
    } else if (doc.msExitFullscreen) {
      doc.msExitFullscreen().catch(() => {});
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!isFullscreen) {
      enterFullscreen();
    } else {
      exitFullscreen();
    }
  }, [isFullscreen, enterFullscreen, exitFullscreen]);

  // Track native fullscreen changes across browsers
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFull = Boolean(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );
      setIsFullscreen(isCurrentlyFull);
      if (isCurrentlyFull) {
        setHasPromptBeenDismissed(true);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  // First tap anywhere on screen prompts fullscreen seamlessly
  const handleContainerTap = () => {
    if (!isFullscreen && !hasPromptBeenDismissed) {
      enterFullscreen();
    }
  };

  return (
    <div 
      onClick={handleContainerTap}
      className="min-h-[100dvh] h-[100dvh] w-full bg-slate-100 flex items-center justify-center p-0 sm:p-4 overflow-hidden select-none font-sans relative"
    >
      {/* 
        Sleek iOS Fullscreen Prompt on Entry:
        - Tapping anywhere or tapping this banner triggers fullscreen
        - Disappears immediately once fullscreen is entered or dismissed
      */}
      {!isFullscreen && !hasPromptBeenDismissed && (
        <div 
          onClick={(e) => {
            e.stopPropagation();
            enterFullscreen();
          }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-40 px-4 py-2 rounded-full bg-white/95 text-slate-800 text-xs sm:text-sm font-bold border border-slate-300 flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
        >
          <Maximize className="w-4 h-4 text-emerald-700" />
          <span>Tap to Enter Fullscreen</span>
        </div>
      )}

      {/* Discreet floating fullscreen toggle button in the top corner */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleFullscreen();
        }}
        aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        className="fixed top-3 right-3 z-30 p-2.5 rounded-full bg-white/80 hover:bg-white text-slate-700 hover:text-slate-950 border border-slate-200 transition-all active:scale-90"
      >
        {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
      </button>

      {/* Vertical Presentation Container */}
      <div className="w-full h-full sm:h-[94dvh] sm:max-w-md sm:aspect-[9/16] flex flex-col justify-center">
        <SlideViewer
          currentSlide={state?.currentSlide ?? 1}
          isBlank={Boolean(state?.isBlank)}
          presentationTitle={state?.title || 'Priority Bible Study'}
          className="h-full rounded-none sm:rounded-3xl border-0 sm:border border-slate-200"
        />
      </div>
    </div>
  );
};
