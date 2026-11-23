'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { SlideViewer } from '../presentation/SlideViewer';
import { getSlidesByTitle, isWidescreenPresentation } from '@/lib/samplePresentation';
import { EndSessionModal } from './EndSessionModal';
import { ShareModal } from '../shared/ShareModal';
import { socket } from '@/lib/socket';
import { 
  ChevronLeft, ChevronRight, EyeOff, Maximize, Share2, Trash2, Users, 
  Layers, X, Monitor, Square
} from 'lucide-react';
import { PublicPresentationState } from '@/types';

interface PresentationAdminDashboardProps {
  state: PublicPresentationState;
  token: string;
  onSlideChange: (slideIndex: number, isBlank?: boolean) => void;
  onToggleBlank: () => void;
  onEndSession: () => void;
}

const ICE_SERVERS: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun.cloudflare.com:3478' },
  ],
  iceCandidatePoolSize: 10,
  bundlePolicy: 'max-bundle',
  rtcpMuxPolicy: 'require',
};

export const PresentationAdminDashboard: React.FC<PresentationAdminDashboardProps> = ({
  state,
  token,
  onSlideChange,
  onToggleBlank,
  onEndSession,
}) => {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isEndModalOpen, setIsEndModalOpen] = useState(false);
  const [isDesktopDeckOpen, setIsDesktopDeckOpen] = useState(false);

  const slides = getSlidesByTitle(state.title);
  const [localSlide, setLocalSlide] = useState(state.currentSlide || 1);
  const totalSlides = slides.length;

  // Screen Sharing State & WebRTC Refs
  const [isSharingScreen, setIsSharingScreen] = useState(Boolean(state.isScreenSharing));
  const streamRef = useRef<MediaStream | null>(null);
  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);
  const peerConnectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const pendingCandidatesMapRef = useRef<Map<string, RTCIceCandidateInit[]>>(new Map());

  // Sync when server slide state updates
  useEffect(() => {
    if (state.currentSlide && state.currentSlide !== localSlide) {
      setLocalSlide(state.currentSlide);
    }
  }, [state.currentSlide]);

  // Sync screen sharing state from server
  useEffect(() => {
    if (typeof state.isScreenSharing === 'boolean' && state.isScreenSharing !== isSharingScreen) {
      setIsSharingScreen(state.isScreenSharing);
      if (!state.isScreenSharing && streamRef.current) {
        stopScreenShareCleanup();
      }
    }
  }, [state.isScreenSharing]);

  const handlePrev = useCallback(() => {
    if (localSlide > 1) {
      const target = localSlide - 1;
      setLocalSlide(target);
      onSlideChange(target);
    }
  }, [localSlide, onSlideChange]);

  const handleNext = useCallback(() => {
    if (localSlide < totalSlides) {
      const target = localSlide + 1;
      setLocalSlide(target);
      onSlideChange(target);
    }
  }, [localSlide, totalSlides, onSlideChange]);

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
        setLocalSlide(1);
        onSlideChange(1);
      } else if (e.key === 'End') {
        e.preventDefault();
        setLocalSlide(totalSlides);
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
  }, [localSlide, totalSlides, handleNext, handlePrev, onSlideChange, onToggleBlank]);

  // Screen Share Cleanup
  const stopScreenShareCleanup = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoPreviewRef.current) {
      videoPreviewRef.current.srcObject = null;
    }
    peerConnectionsRef.current.forEach((pc) => {
      try {
        pc.close();
      } catch {}
    });
    peerConnectionsRef.current.clear();
    pendingCandidatesMapRef.current.clear();
    setIsSharingScreen(false);
  }, []);

  // Stop Screen Share (Emits to Server)
  const handleStopScreenShare = useCallback(() => {
    stopScreenShareCleanup();
    socket.emit('stopScreenShare', { roomId: state.id, token });
  }, [state.id, token, stopScreenShareCleanup]);

  // Create High-Bandwidth, Real-Time WebRTC Peer Connection for a Viewer
  const createPeerConnectionForViewer = useCallback(async (viewerSocketId: string) => {
    if (!streamRef.current) return;
    try {
      const existingPc = peerConnectionsRef.current.get(viewerSocketId);
      if (existingPc) {
        existingPc.close();
      }

      const pc = new RTCPeerConnection(ICE_SERVERS);
      peerConnectionsRef.current.set(viewerSocketId, pc);

      // Add all tracks with High-Performance parameters
      streamRef.current.getTracks().forEach((track) => {
        const sender = pc.addTrack(track, streamRef.current!);
        try {
          const params = sender.getParameters();
          if (params) {
            if (!params.encodings || params.encodings.length === 0) {
              params.encodings = [{}];
            }
            params.encodings[0].maxBitrate = 12_000_000; // 12 Mbps for razor-sharp presentation text
            params.encodings[0].maxFramerate = 60; // 60 FPS ultra-smooth motion
            (params as any).degradationPreference = 'maintain-resolution';
            sender.setParameters(params).catch(() => {});
          }
        } catch (e) {}
      });

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('sendScreenIceCandidate', {
            targetSocketId: viewerSocketId,
            candidate: event.candidate,
          });
        }
      };

      pc.onconnectionstatechange = () => {
        if (
          pc.connectionState === 'disconnected' ||
          pc.connectionState === 'failed' ||
          pc.connectionState === 'closed'
        ) {
          peerConnectionsRef.current.delete(viewerSocketId);
          pendingCandidatesMapRef.current.delete(viewerSocketId);
        }
      };

      const offer = await pc.createOffer();
      // Inject high-bandwidth b=AS:12000 in video SDP for crystal clarity
      let modifiedSdp = offer.sdp || '';
      if (!modifiedSdp.includes('b=AS:')) {
        modifiedSdp = modifiedSdp.replace(/(m=video .*\r?\n)/, '$1b=AS:12000\r\nb=TIAS:12000000\r\n');
      }
      await pc.setLocalDescription({ type: 'offer', sdp: modifiedSdp });

      socket.emit('sendScreenOffer', {
        targetSocketId: viewerSocketId,
        offer: { type: 'offer', sdp: modifiedSdp },
      });
    } catch (err) {
      console.error('Failed to create screen offer for viewer:', viewerSocketId, err);
    }
  }, []);

  // Start Screen Share (Google Meet Level Crisp Resolution & Real-time reflection)
  const handleStartScreenShare = async () => {
    try {
      if (!navigator.mediaDevices?.getDisplayMedia) {
        alert('Screen sharing is not supported on this browser or platform.');
        return;
      }

      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: 'monitor',
          frameRate: { ideal: 60, max: 60 },
          width: { ideal: 2560, max: 3840 },
          height: { ideal: 1440, max: 2160 },
        } as any,
        audio: false,
      });

      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        // 'detail' tells browser's encoder to preserve razor-sharp text and lines just like Google Meet
        if ('contentHint' in videoTrack) {
          (videoTrack as any).contentHint = 'detail';
        }
        videoTrack.onended = () => {
          handleStopScreenShare();
        };
      }

      streamRef.current = stream;
      setIsSharingScreen(true);

      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
        videoPreviewRef.current.play().catch(() => {});
      }

      socket.emit(
        'startScreenShare',
        { roomId: state.id, token },
        (res?: { success: boolean; viewerSocketIds?: string[] }) => {
          // Immediately connect to all active viewers with zero delay
          if (res?.viewerSocketIds && res.viewerSocketIds.length > 0) {
            res.viewerSocketIds.forEach((viewerId) => {
              createPeerConnectionForViewer(viewerId);
            });
          }
        }
      );
    } catch (err: any) {
      console.log('Screen sharing cancelled or permission denied:', err);
    }
  };

  // High-Quality Frame Relay Fallback (Provides instant preview without bottlenecking CPU)
  useEffect(() => {
    if (!isSharingScreen || !streamRef.current) return;

    let animId: number;
    let lastTime = 0;
    const fpsInterval = 1000 / 10; // 10 FPS lightweight fallback

    const hiddenVideo = document.createElement('video');
    hiddenVideo.srcObject = streamRef.current;
    hiddenVideo.muted = true;
    hiddenVideo.playsInline = true;
    hiddenVideo.play().catch(() => {});

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { alpha: false });

    const captureFrame = (time: number) => {
      animId = requestAnimationFrame(captureFrame);

      if (time - lastTime < fpsInterval) return;
      lastTime = time;

      if (hiddenVideo.readyState >= 2 && hiddenVideo.videoWidth > 0) {
        // Full resolution preservation for sharp text
        const w = hiddenVideo.videoWidth;
        const h = hiddenVideo.videoHeight;

        if (canvas.width !== w || canvas.height !== h) {
          canvas.width = w;
          canvas.height = h;
        }

        if (ctx) {
          ctx.drawImage(hiddenVideo, 0, 0, w, h);
          // High quality JPEG (0.85) ensures zero text blur
          const frameData = canvas.toDataURL('image/jpeg', 0.85);
          socket.emit('sendScreenFrame', { roomId: state.id, frame: frameData, token });
        }
      }
    };

    animId = requestAnimationFrame(captureFrame);

    return () => {
      cancelAnimationFrame(animId);
      hiddenVideo.srcObject = null;
    };
  }, [isSharingScreen, state.id, token]);

  // WebRTC Signaling Handlers (Relaying Screen Stream to Viewers)
  useEffect(() => {
    const handleViewerRequestStream = async ({ viewerSocketId }: { viewerSocketId: string }) => {
      createPeerConnectionForViewer(viewerSocketId);
    };

    const handleScreenAnswer = async ({
      fromSocketId,
      answer,
    }: {
      fromSocketId: string;
      answer: any;
    }) => {
      const pc = peerConnectionsRef.current.get(fromSocketId);
      if (pc) {
        try {
          await pc.setRemoteDescription(new RTCSessionDescription(answer));

          // Flush any buffered candidates for this viewer
          const pending = pendingCandidatesMapRef.current.get(fromSocketId);
          if (pending && pending.length > 0) {
            while (pending.length > 0) {
              const cand = pending.shift();
              if (cand) {
                await pc.addIceCandidate(new RTCIceCandidate(cand)).catch(() => {});
              }
            }
          }
        } catch (err) {
          console.error('Failed to set remote description from answer:', err);
        }
      }
    };

    const handleScreenIceCandidate = async ({
      fromSocketId,
      candidate,
    }: {
      fromSocketId: string;
      candidate: any;
    }) => {
      const pc = peerConnectionsRef.current.get(fromSocketId);
      if (pc && pc.remoteDescription) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (err) {
          console.error('Failed to add ICE candidate from viewer:', err);
        }
      } else {
        if (!pendingCandidatesMapRef.current.has(fromSocketId)) {
          pendingCandidatesMapRef.current.set(fromSocketId, []);
        }
        pendingCandidatesMapRef.current.get(fromSocketId)!.push(candidate);
      }
    };

    const handleViewerLeftStream = ({ viewerSocketId }: { viewerSocketId: string }) => {
      const pc = peerConnectionsRef.current.get(viewerSocketId);
      if (pc) {
        pc.close();
        peerConnectionsRef.current.delete(viewerSocketId);
        pendingCandidatesMapRef.current.delete(viewerSocketId);
      }
    };

    socket.on('viewerRequestStream', handleViewerRequestStream);
    socket.on('screenAnswer', handleScreenAnswer);
    socket.on('screenIceCandidate', handleScreenIceCandidate);
    socket.on('viewerLeftStream', handleViewerLeftStream);

    return () => {
      socket.off('viewerRequestStream', handleViewerRequestStream);
      socket.off('screenAnswer', handleScreenAnswer);
      socket.off('screenIceCandidate', handleScreenIceCandidate);
      socket.off('viewerLeftStream', handleViewerLeftStream);
    };
  }, [createPeerConnectionForViewer]);

  // Make sure videoPreviewRef stays synced when stream is active
  useEffect(() => {
    if (isSharingScreen && streamRef.current && videoPreviewRef.current) {
      if (videoPreviewRef.current.srcObject !== streamRef.current) {
        videoPreviewRef.current.srcObject = streamRef.current;
        videoPreviewRef.current.play().catch(() => {});
      }
    }
  }, [isSharingScreen]);

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

          {/* Screen Share Button */}
          {isSharingScreen ? (
            <button
              onClick={handleStopScreenShare}
              className="px-3.5 py-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-red-200 transition-all animate-pulse"
            >
              <Square className="w-3.5 h-3.5 fill-white" />
              <span>Stop Screen Share</span>
            </button>
          ) : (
            <button
              onClick={handleStartScreenShare}
              className="px-3.5 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-100 transition-all"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Share Screen</span>
            </button>
          )}

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
        - Admin sees either the Live Screen Share Monitor or the active Slide
        - On Mobile: Edge-to-edge full height (100dvh), zero header/deck clutter
        - On Desktop: Centered widescreen 16:9 frame
      */}
      <main className="flex-1 w-full flex items-center justify-center relative p-0 sm:p-4 overflow-hidden">
        
        {/* The Exact Slide or Live Screen View */}
        <div className={`w-full h-full ${
          isSharingScreen || isWidescreenPresentation(state?.title, slides)
            ? 'sm:h-auto sm:max-w-5xl md:max-w-6xl lg:max-w-7xl sm:aspect-[16/9] px-0 sm:px-4' 
            : 'sm:h-[94dvh] sm:max-w-md sm:aspect-[9/16]'
        } flex flex-col justify-center relative`}>
          
          {isSharingScreen ? (
            /* Live Screen Share Host Monitor */
            <div className="w-full h-full bg-slate-950 border border-slate-800 rounded-none sm:rounded-3xl p-3 sm:p-5 flex flex-col justify-between relative overflow-hidden shadow-2xl">
              <div className="flex-1 w-full h-full flex items-center justify-center relative overflow-hidden">
                <video
                  ref={videoPreviewRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full max-h-[82dvh] object-contain rounded-xl select-none"
                  style={{
                    imageRendering: '-webkit-optimize-contrast',
                    transform: 'translateZ(0)',
                  }}
                />
              </div>

              {/* Status Bar */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-white z-10 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="tracking-wide">BROADCASTING SCREEN LIVE</span>
                  <span className="text-emerald-400 font-mono hidden sm:inline">(Ultra-HD 60 FPS • Real-Time Reflection)</span>
                </div>
                <button
                  type="button"
                  onClick={handleStopScreenShare}
                  className="px-3 py-1 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold flex items-center gap-1 transition-all"
                >
                  <Square className="w-3 h-3 fill-white" />
                  <span>Stop Sharing</span>
                </button>
              </div>
            </div>
          ) : (
            <SlideViewer 
              key={localSlide}
              currentSlide={localSlide} 
              isBlank={Boolean(state?.isBlank)}
              presentationTitle={state?.title || 'SQL Workshop'}
              slides={slides}
              className="h-full rounded-none sm:rounded-3xl border-0 sm:border border-slate-200"
            />
          )}
        </div>

        {/* 
          iOS Left Floating Navigation Chevron:
          - High touch area on the left edge for single-thumb backward navigation
          - Hidden when screen sharing is active
        */}
        {!isSharingScreen && (
          <button
            onClick={handlePrev}
            disabled={localSlide <= 1}
            aria-label="Previous Slide"
            className={`fixed left-2 sm:left-6 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-white/90 hover:bg-white text-slate-800 border border-slate-200/90 backdrop-blur-md flex items-center justify-center active:scale-90 transition-all ${
              localSlide <= 1 ? 'opacity-30 pointer-events-none' : 'hover:border-slate-400'
            }`}
            title="Previous Slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* 
          iOS Right Floating Navigation Chevron:
          - High touch area on the right edge for single-thumb forward navigation
          - Hidden when screen sharing is active
        */}
        {!isSharingScreen && (
          <button
            onClick={handleNext}
            disabled={localSlide >= totalSlides}
            aria-label="Next Slide"
            className={`fixed right-2 sm:right-6 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-slate-900/90 hover:bg-slate-950 text-white border border-slate-800 backdrop-blur-md flex items-center justify-center active:scale-90 transition-all ${
              localSlide >= totalSlides ? 'opacity-30 pointer-events-none' : 'hover:bg-black'
            }`}
            title="Next Slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* 
          iOS Bottom Dynamic Island Pill (Admin Control Bar):
          - Minimal, floating at bottom center of the screen
          - Displays current slide index (e.g. 12 / 28) or Live Screen indicator
          - Quick Screen Share toggle
          - Quick Blank toggle
          - Quick Share & Exit buttons
        */}
        <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 bg-white/95 backdrop-blur-lg border border-slate-200/90 rounded-full px-4 py-2 flex items-center gap-3 shadow-lg">
          
          {/* Slide Indicator Badge or Screen Share Status */}
          {isSharingScreen ? (
            <div className="flex items-center gap-1.5 font-sans text-xs font-extrabold text-red-600 px-2 py-0.5 rounded-full bg-red-50 border border-red-200">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              <span>SCREEN LIVE</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 font-mono text-xs font-extrabold text-slate-800 px-2 py-0.5 rounded-full bg-slate-100">
              <span>{localSlide}</span>
              <span className="text-slate-400">/</span>
              <span>{totalSlides}</span>
            </div>
          )}

          <div className="h-4 w-px bg-slate-200" />

          {/* Screen Share Button in Bottom Pill */}
          {isSharingScreen ? (
            <button
              onClick={handleStopScreenShare}
              className="p-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1 transition-all"
              title="Stop Sharing Screen"
            >
              <Square className="w-3.5 h-3.5 fill-white" />
              <span className="text-[11px] font-bold pr-1">Stop</span>
            </button>
          ) : (
            <button
              onClick={handleStartScreenShare}
              className="p-1.5 rounded-full text-blue-700 hover:text-blue-900 hover:bg-blue-50 transition-colors"
              title="Share Your Screen"
            >
              <Monitor className="w-4 h-4" />
            </button>
          )}

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

          {/* Quick Fullscreen on Mobile */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-full text-slate-600 hover:text-slate-950 hover:bg-slate-100 transition-colors sm:hidden"
            title="Toggle Fullscreen"
          >
            <Maximize className="w-4 h-4" />
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
              const isActive = slideNum === localSlide;

              return (
                <button
                  key={slide.id}
                  onClick={() => {
                    setLocalSlide(slideNum);
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
