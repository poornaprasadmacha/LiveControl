'use client';

import React, { useState, useEffect, useRef } from 'react';
import { socket } from '@/lib/socket';
import { Mic, MicOff, Hand, Volume2, CheckCircle2, X, Radio } from 'lucide-react';

interface SpeakRequest {
  participantId: string;
  socketId: string;
  nickname: string;
}

interface VoiceControlProps {
  roomId: string;
  role: 'ADMIN' | 'VIEWER' | 'PARTICIPANT';
  token?: string;
  participantId?: string;
  nickname?: string;
}

export const VoiceControl: React.FC<VoiceControlProps> = ({
  roomId,
  role,
  token,
  participantId,
  nickname,
}) => {
  const [isMicOn, setIsMicOn] = useState(false);
  const [hasPermissionToSpeak, setHasPermissionToSpeak] = useState(role === 'ADMIN');
  const [hasRequestedSpeak, setHasRequestedSpeak] = useState(false);
  const [speakRequests, setSpeakRequests] = useState<SpeakRequest[]>([]);
  const [activeSpeaker, setActiveSpeaker] = useState<string | null>(null);

  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);

  const iceServers = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ],
  };

  useEffect(() => {
    // WebRTC Signaling Listeners
    const handleOffer = async (data: { senderSocketId: string; sdp: any; senderRole: string; nickname?: string }) => {
      try {
        const pc = createPeerConnection(data.senderSocketId);
        await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        socket.emit('sendWebrtcAnswer', {
          targetSocketId: data.senderSocketId,
          sdp: answer,
        });

        if (data.nickname) {
          setActiveSpeaker(data.nickname);
        } else if (data.senderRole === 'ADMIN') {
          setActiveSpeaker('Host');
        }
      } catch (err) {
        console.error('Error handling WebRTC offer:', err);
      }
    };

    const handleAnswer = async (data: { senderSocketId: string; sdp: any }) => {
      const pc = peerConnectionsRef.current.get(data.senderSocketId);
      if (pc) {
        await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
      }
    };

    const handleIceCandidate = async (data: { senderSocketId: string; candidate: any }) => {
      const pc = peerConnectionsRef.current.get(data.senderSocketId);
      if (pc && data.candidate) {
        await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
      }
    };

    const handleSpeakRequested = (data: SpeakRequest) => {
      if (role === 'ADMIN') {
        setSpeakRequests((prev) => {
          if (prev.some((r) => r.socketId === data.socketId)) return prev;
          return [...prev, data];
        });
      }
    };

    const handleSpeakPermissionGranted = (data: { allowed: boolean }) => {
      setHasPermissionToSpeak(data.allowed);
      if (data.allowed) {
        setHasRequestedSpeak(false);
      }
    };

    socket.on('webrtcOffer', handleOffer);
    socket.on('webrtcAnswer', handleAnswer);
    socket.on('webrtcIceCandidate', handleIceCandidate);
    socket.on('speakRequested', handleSpeakRequested);
    socket.on('speakPermissionGranted', handleSpeakPermissionGranted);

    return () => {
      socket.off('webrtcOffer', handleOffer);
      socket.off('webrtcAnswer', handleAnswer);
      socket.off('webrtcIceCandidate', handleIceCandidate);
      socket.off('speakRequested', handleSpeakRequested);
      socket.off('speakPermissionGranted', handleSpeakPermissionGranted);
      stopLocalStream();
    };
  }, [roomId, role]);

  const createPeerConnection = (targetSocketId: string): RTCPeerConnection => {
    const pc = new RTCPeerConnection(iceServers);
    peerConnectionsRef.current.set(targetSocketId, pc);

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('sendWebrtcIceCandidate', {
          targetSocketId,
          candidate: event.candidate,
        });
      }
    };

    pc.ontrack = (event) => {
      if (remoteAudioRef.current && event.streams[0]) {
        remoteAudioRef.current.srcObject = event.streams[0];
        remoteAudioRef.current.play().catch(() => {});
      }
    };

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current!);
      });
    }

    return pc;
  };

  const toggleMic = async () => {
    if (isMicOn) {
      stopLocalStream();
      setIsMicOn(false);
      socket.emit('toggleAudioMute', { roomId, isMuted: true });
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        localStreamRef.current = stream;
        setIsMicOn(true);
        socket.emit('toggleAudioMute', { roomId, isMuted: false });

        // Initiate WebRTC offers to peers
        // Broadcast offer
      } catch (err) {
        console.error('Microphone access denied:', err);
        alert('Microphone access denied by browser settings.');
      }
    }
  };

  const stopLocalStream = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }
    peerConnectionsRef.current.forEach((pc) => pc.close());
    peerConnectionsRef.current.clear();
  };

  const handleRequestToSpeak = () => {
    if (participantId && nickname) {
      socket.emit('requestToSpeak', { roomId, participantId, nickname });
      setHasRequestedSpeak(true);
    }
  };

  const handleAllowSpeak = (targetSocketId: string) => {
    if (token) {
      socket.emit('grantSpeakPermission', { roomId, targetSocketId, allowed: true, token });
      setSpeakRequests((prev) => prev.filter((r) => r.socketId !== targetSocketId));
    }
  };

  const handleDenySpeak = (targetSocketId: string) => {
    if (token) {
      socket.emit('grantSpeakPermission', { roomId, targetSocketId, allowed: false, token });
      setSpeakRequests((prev) => prev.filter((r) => r.socketId !== targetSocketId));
    }
  };

  return (
    <div className="bg-white dark:bg-brand-darkCard border border-sky-100 dark:border-brand-darkBorder rounded-2xl p-3 shadow-sm flex items-center justify-between gap-3 text-xs">
      {/* Hidden HTML5 Audio Element for Remote Voice Output */}
      <audio ref={remoteAudioRef} autoPlay playsInline className="hidden" />

      {/* Active Speaker Indicator */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-teal-50 dark:bg-brand-darkBg text-brand-secondary flex items-center justify-center">
          <Volume2 className="w-4 h-4" />
        </div>
        <div>
          <span className="font-extrabold text-slate-900 dark:text-white block leading-none">
            Real-Time Voice
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
            {activeSpeaker ? `🔊 ${activeSpeaker} Speaking` : isMicOn ? '🎙️ Mic Live' : 'Room Audio Ready'}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        {hasPermissionToSpeak && (
          <button
            onClick={toggleMic}
            className={`px-3 py-1.5 rounded-xl font-extrabold text-xs flex items-center gap-1.5 transition-all ${
              isMicOn
                ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-md animate-pulse'
                : 'bg-brand-primary hover:bg-brand-primaryDark text-white shadow-sm'
            }`}
          >
            {isMicOn ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
            <span>{isMicOn ? 'Mute Mic' : 'Turn Mic On'}</span>
          </button>
        )}

        {role === 'PARTICIPANT' && !hasPermissionToSpeak && (
          <button
            onClick={handleRequestToSpeak}
            disabled={hasRequestedSpeak}
            className={`px-3 py-1.5 rounded-xl font-extrabold text-xs flex items-center gap-1.5 transition-all ${
              hasRequestedSpeak
                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                : 'bg-brand-secondary hover:bg-brand-secondaryDark text-white shadow-sm'
            }`}
          >
            <Hand className="w-3.5 h-3.5" />
            <span>{hasRequestedSpeak ? 'Request Sent...' : '✋ Request to Speak'}</span>
          </button>
        )}

        {/* Host Speak Requests List Modal / Overlay */}
        {role === 'ADMIN' && speakRequests.length > 0 && (
          <div className="relative group">
            <span className="px-2 py-1 rounded-lg bg-amber-500 text-white font-mono font-bold text-[11px] animate-bounce">
              ✋ {speakRequests.length} Request
            </span>

            <div className="absolute bottom-full right-0 mb-2 w-64 bg-white dark:bg-brand-darkCard border border-amber-200 dark:border-brand-darkBorder rounded-2xl p-3 shadow-2xl space-y-2 z-50">
              <span className="text-[11px] font-black uppercase text-amber-600 tracking-wider block">
                Speaker Requests
              </span>
              {speakRequests.map((req) => (
                <div key={req.socketId} className="flex items-center justify-between bg-amber-50 dark:bg-brand-darkBg p-2 rounded-xl text-xs">
                  <span className="font-extrabold truncate">{req.nickname}</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleAllowSpeak(req.socketId)}
                      className="p-1 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
                      title="Allow Mic"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDenySpeak(req.socketId)}
                      className="p-1 bg-rose-600 text-white rounded-md hover:bg-rose-700"
                      title="Deny"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
