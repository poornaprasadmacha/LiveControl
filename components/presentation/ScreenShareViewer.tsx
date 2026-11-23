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
  ],
};

export const ScreenShareViewer: React.FC<ScreenShareViewerProps> = ({
  roomId,
  adminSocketId,
  className = '',
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const [isReceiving, setIsReceiving] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pendingCandidatesRef = useRef<RTCIceCandidateInit[]>([]);

  useEffect(() => {
    // Request stream from the screen sharing host
    const requestStream = () => {
      socket.emit('requestScreenStream', { roomId });
    };

    // Handle incoming WebRTC Offer from Admin
    const handleScreenOffer = async ({ fromSocketId, offer }: { fromSocketId: string; offer: any }) => {
      try {
        if (pcRef.current) {
          pcRef.current.close();
        }

        const pc = new RTCPeerConnection(ICE_SERVERS);
        pcRef.current = pc;

        pc.ontrack = (event) => {
          if (videoRef.current && event.streams && event.streams[0]) {
            videoRef.current.srcObject = event.streams[0];
            setIsReceiving(true);
            videoRef.current.play().catch(() => {});
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
            setIsReceiving(true);
          } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
            setIsReceiving(false);
            // Re-request stream if disconnected
            requestStream();
          }
        };

        await pc.setRemoteDescription(new RTCSessionDescription(offer));

        // Flush any buffered candidates
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

    // Handle incoming ICE Candidate from Admin
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

    socket.on('screenOffer', handleScreenOffer);
    socket.on('screenIceCandidate', handleScreenIceCandidate);

    // Initial stream request
    requestStream();

    // Polling retry for ultra-fast connection if stream not established within 1.5s
    const retryInterval = setInterval(() => {
      if (!isReceiving) {
        requestStream();
      }
    }, 2000);

    return () => {
      clearInterval(retryInterval);
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
  }, [roomId]);

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
      className={`relative w-full h-full bg-slate-950 flex items-center justify-center overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-800 shadow-2xl ${className}`}
    >
      {/* Live Screen Video Element */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`w-full h-full max-h-[92dvh] object-contain transition-opacity duration-300 ${
          isReceiving ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Connecting Loading Indicator */}
      {!isReceiving && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white p-6 text-center select-none bg-slate-950/90 backdrop-blur-sm z-10">
          <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center animate-pulse">
            <Monitor className="w-8 h-8 text-blue-400" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
              <span>Receiving Host Screen...</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">
              Connecting real-time 60 FPS ultra-low latency stream
            </p>
          </div>
        </div>
      )}

      {/* Top Left Live Indicator Pill */}
      {isReceiving && (
        <div className="absolute top-3 left-3 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-white text-xs font-bold tracking-wide shadow-lg select-none">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
          <span>LIVE SCREEN</span>
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
