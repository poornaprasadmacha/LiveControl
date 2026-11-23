'use client';

import React, { useEffect, useRef, useState } from 'react';
import { socket } from '@/lib/socket';
import { Monitor, Maximize, Minimize, Loader2 } from 'lucide-react';

interface ScreenShareViewerProps {
  roomId: string;
  adminSocketId?: string | null;
  className?: string;
}

const ICE_SERVERS: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' },
    { urls: 'stun:global.stun.twilio.com:3478' },
  ],
};

export const ScreenShareViewer: React.FC<ScreenShareViewerProps> = ({
  roomId,
  adminSocketId,
  className = '',
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pendingCandidatesRef = useRef<RTCIceCandidateInit[]>([]);

  // Dual-Engine State: WebRTC + Real-Time Frame Relay
  const [isWebRtcPlaying, setIsWebRtcPlaying] = useState(false);
  const [latestFrame, setLatestFrame] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const hasContent = isWebRtcPlaying || Boolean(latestFrame);

  useEffect(() => {
    // 1. Request stream from host
    const requestStream = () => {
      socket.emit('requestScreenStream', { roomId });
    };

    // 2. Real-Time Frame Relay listener (Zero-delay fallback & instant display)
    const handleScreenFrame = (data: { frame: string }) => {
      if (data?.frame) {
        setLatestFrame(data.frame);
      }
    };

    // 3. WebRTC Offer Handler
    const handleScreenOffer = async ({ fromSocketId, offer }: { fromSocketId: string; offer: any }) => {
      try {
        if (pcRef.current) {
          pcRef.current.close();
        }

        const pc = new RTCPeerConnection(ICE_SERVERS);
        pcRef.current = pc;

        pc.ontrack = (event) => {
          // Robust stream retrieval: Handles cases where event.streams is empty
          const stream = (event.streams && event.streams[0]) || new MediaStream([event.track]);
          
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.muted = true;
            videoRef.current.defaultMuted = true;
            videoRef.current.setAttribute('playsinline', '');
            videoRef.current.setAttribute('webkit-playsinline', '');

            videoRef.current
              .play()
              .then(() => {
                setIsWebRtcPlaying(true);
              })
              .catch((err) => {
                console.log('WebRTC video autoplay waiting for user interaction:', err);
              });
          }
        };

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit('sendScreenIceCandidate', {
              targetSocketId: fromSocketId,
              candidate: event.candidate,
            });
          }
        };

        pc.onconnectionstatechange = () => {
          if (pc.connectionState === 'connected') {
            setIsWebRtcPlaying(true);
          } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
            setIsWebRtcPlaying(false);
            requestStream();
          }
        };

        await pc.setRemoteDescription(new RTCSessionDescription(offer));

        // Flush queued candidates
        while (pendingCandidatesRef.current.length > 0) {
          const cand = pendingCandidatesRef.current.shift();
          if (cand) {
            await pc.addIceCandidate(new RTCIceCandidate(cand)).catch(() => {});
          }
        }

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        socket.emit('sendScreenAnswer', {
          targetSocketId: fromSocketId,
          answer,
        });
      } catch (err) {
        console.error('Failed to handle incoming screen offer:', err);
      }
    };

    // 4. WebRTC ICE Candidate Handler
    const handleScreenIceCandidate = async ({ candidate }: { fromSocketId: string; candidate: any }) => {
      try {
        if (pcRef.current && pcRef.current.remoteDescription) {
          await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        } else {
          pendingCandidatesRef.current.push(candidate);
        }
      } catch (err) {
        console.error('Failed to add screen ICE candidate:', err);
      }
    };

    socket.on('screenFrame', handleScreenFrame);
    socket.on('screenOffer', handleScreenOffer);
    socket.on('screenIceCandidate', handleScreenIceCandidate);

    requestStream();

    const interval = setInterval(() => {
      if (!isWebRtcPlaying) {
        requestStream();
      }
    }, 2000);

    return () => {
      clearInterval(interval);
      socket.off('screenFrame', handleScreenFrame);
      socket.off('screenOffer', handleScreenOffer);
      socket.off('screenIceCandidate', handleScreenIceCandidate);

      if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [roomId, isWebRtcPlaying]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full bg-slate-950 flex items-center justify-center overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-800 shadow-2xl select-none ${className}`}
    >
      {/* 
        Dual-Engine Video & Frame Rendering:
        1. High-Performance WebRTC Video (smooth 60 FPS P2P stream)
        2. Real-Time Frame Relay (guarantees zero dark/blank screen everywhere)
      */}

      {/* Layer 1: Real-Time Frame Relay Image (Immediate display) */}
      {latestFrame && !isWebRtcPlaying && (
        <img
          src={latestFrame}
          alt="Host Live Screen"
          className="w-full h-full max-h-[92dvh] object-contain select-none"
        />
      )}

      {/* Layer 2: Ultra-Low Latency WebRTC Video Element */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        onPlaying={() => setIsWebRtcPlaying(true)}
        className={`w-full h-full max-h-[92dvh] object-contain transition-opacity duration-200 ${
          isWebRtcPlaying ? 'opacity-100' : 'opacity-0 absolute pointer-events-none'
        }`}
      />

      {/* Loading Screen: Only shown before the very first frame or video arrives */}
      {!hasContent && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white p-6 text-center select-none bg-slate-950/90 backdrop-blur-sm z-10">
          <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center animate-pulse">
            <Monitor className="w-8 h-8 text-blue-400" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
              <span>Connecting to Host Screen...</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">
              Starting real-time live presentation stream
            </p>
          </div>
        </div>
      )}

      {/* Top Left Live Indicator Pill */}
      {hasContent && (
        <div className="absolute top-3 left-3 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-white text-xs font-bold tracking-wide shadow-lg select-none">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
          <span>LIVE SCREEN</span>
          <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
            {isWebRtcPlaying ? 'HD 60FPS' : 'REAL-TIME'}
          </span>
        </div>
      )}

      {/* Top Right Fullscreen Button */}
      <button
        type="button"
        onClick={toggleFullscreen}
        aria-label="Toggle Fullscreen"
        className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/75 hover:bg-black/90 backdrop-blur-md border border-white/10 text-white/90 hover:text-white transition-all active:scale-95 shadow-lg"
      >
        {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
      </button>
    </div>
  );
};
