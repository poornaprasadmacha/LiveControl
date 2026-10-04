'use client';

import React, { useState, useEffect, useRef } from 'react';
import { socket } from '@/lib/socket';
import { Mic, MicOff, Volume2, VolumeX, Radio, Sparkles } from 'lucide-react';

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
  nickname,
}) => {
  const [isMicOn, setIsMicOn] = useState(false);
  const [isAudioUnlocked, setIsAudioUnlocked] = useState(false);
  const [activeSpeaker, setActiveSpeaker] = useState<string | null>(null);
  const [speakingUsers, setSpeakingUsers] = useState<Map<string, string>>(new Map());

  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const audioContainerRef = useRef<HTMLDivElement | null>(null);

  const iceServers = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
    ],
  };

  useEffect(() => {
    // 1. WebRTC Signaling Listeners
    const handleOffer = async (data: { senderSocketId: string; sdp: any; senderRole: string; nickname?: string }) => {
      try {
        console.log(`🎙️ Received WebRTC offer from ${data.nickname || data.senderRole}`);
        const pc = getOrCreatePeerConnection(data.senderSocketId, data.nickname || data.senderRole);

        await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));

        // Add local tracks if we are also broadcasting
        if (localStreamRef.current) {
          localStreamRef.current.getTracks().forEach((track) => {
            pc.addTrack(track, localStreamRef.current!);
          });
        }

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        socket.emit('sendWebrtcAnswer', {
          targetSocketId: data.senderSocketId,
          sdp: answer,
        });

        const speakerName = data.nickname || (data.senderRole === 'ADMIN' ? 'Host' : 'Audience Member');
        setActiveSpeaker(speakerName);
      } catch (err) {
        console.error('Error handling WebRTC offer:', err);
      }
    };

    const handleAnswer = async (data: { senderSocketId: string; sdp: any }) => {
      try {
        const pc = peerConnectionsRef.current.get(data.senderSocketId);
        if (pc) {
          await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
        }
      } catch (err) {
        console.error('Error setting remote answer:', err);
      }
    };

    const handleIceCandidate = async (data: { senderSocketId: string; candidate: any }) => {
      try {
        const pc = peerConnectionsRef.current.get(data.senderSocketId);
        if (pc && data.candidate) {
          await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
        }
      } catch (err) {
        console.error('Error adding ICE candidate:', err);
      }
    };

    const handleUserStartedVoice = async (data: { socketId: string; role: string; nickname?: string }) => {
      console.log(`🔊 ${data.nickname || data.role} started voice broadcasting`);
      const speakerName = data.nickname || (data.role === 'ADMIN' ? 'Host' : 'Audience Member');
      setActiveSpeaker(speakerName);

      // Initiate WebRTC offer to the new speaker if we have a local mic stream or to receive audio
      try {
        const pc = getOrCreatePeerConnection(data.socketId, speakerName);
        const offer = await pc.createOffer({ offerToReceiveAudio: true });
        await pc.setLocalDescription(offer);

        socket.emit('sendWebrtcOffer', {
          targetSocketId: data.socketId,
          sdp: offer,
          senderRole: role,
          nickname: nickname || (role === 'ADMIN' ? 'Host' : 'Viewer'),
        });
      } catch (err) {
        console.error('Error initiating offer to new speaker:', err);
      }
    };

    const handleUserStoppedVoice = (data: { socketId: string }) => {
      const pc = peerConnectionsRef.current.get(data.socketId);
      if (pc) {
        pc.close();
        peerConnectionsRef.current.delete(data.socketId);
      }
      removeAudioElement(data.socketId);
      setActiveSpeaker(null);
    };

    socket.on('webrtcOffer', handleOffer);
    socket.on('webrtcAnswer', handleAnswer);
    socket.on('webrtcIceCandidate', handleIceCandidate);
    socket.on('userStartedVoice', handleUserStartedVoice);
    socket.on('userStoppedVoice', handleUserStoppedVoice);

    return () => {
      socket.off('webrtcOffer', handleOffer);
      socket.off('webrtcAnswer', handleAnswer);
      socket.off('webrtcIceCandidate', handleIceCandidate);
      socket.off('userStartedVoice', handleUserStartedVoice);
      socket.off('userStoppedVoice', handleUserStoppedVoice);
      stopLocalStream();
    };
  }, [roomId, role, nickname]);

  const getOrCreatePeerConnection = (targetSocketId: string, speakerName: string): RTCPeerConnection => {
    let pc = peerConnectionsRef.current.get(targetSocketId);
    if (pc) return pc;

    pc = new RTCPeerConnection(iceServers);
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
      console.log(`🔊 Remote audio track received from ${speakerName}`);
      attachAudioTrack(targetSocketId, event.streams[0]);
    };

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        pc!.addTrack(track, localStreamRef.current!);
      });
    }

    return pc;
  };

  const attachAudioTrack = (socketId: string, stream: MediaStream) => {
    let audioEl = document.getElementById(`remote-audio-${socketId}`) as HTMLAudioElement;
    if (!audioEl) {
      audioEl = document.createElement('audio');
      audioEl.id = `remote-audio-${socketId}`;
      audioEl.autoplay = true;
      audioEl.setAttribute('playsinline', 'true');
      if (audioContainerRef.current) {
        audioContainerRef.current.appendChild(audioEl);
      }
    }
    audioEl.srcObject = stream;
    audioEl.play().then(() => {
      setIsAudioUnlocked(true);
    }).catch((err) => {
      console.warn('Autoplay blocked by browser policy:', err);
      setIsAudioUnlocked(false);
    });
  };

  const removeAudioElement = (socketId: string) => {
    const audioEl = document.getElementById(`remote-audio-${socketId}`) as HTMLAudioElement | null;
    if (audioEl) {
      audioEl.pause();
      audioEl.srcObject = null;
      audioEl.remove();
    }
  };

  const unlockBrowserAudio = () => {
    // Unblock browser autoplay policy
    const elements = document.querySelectorAll('audio');
    elements.forEach((el) => {
      el.play().catch(() => {});
    });
    setIsAudioUnlocked(true);
  };

  const toggleMic = async () => {
    unlockBrowserAudio();

    if (isMicOn) {
      stopLocalStream();
      setIsMicOn(false);
      socket.emit('stopVoiceBroadcast', { roomId });
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        localStreamRef.current = stream;
        setIsMicOn(true);

        const displayName = nickname || (role === 'ADMIN' ? 'Host' : 'Participant');
        socket.emit('startVoiceBroadcast', { roomId, role, nickname: displayName });
      } catch (err) {
        console.error('Microphone access error:', err);
        alert('Could not access microphone. Please allow microphone permissions in your browser.');
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

  return (
    <div className="flex items-center gap-2">
      {/* Hidden Audio Elements Container */}
      <div ref={audioContainerRef} className="hidden" />

      {/* Autoplay Unlock Button if blocked */}
      {!isAudioUnlocked && activeSpeaker && (
        <button
          onClick={unlockBrowserAudio}
          className="px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md animate-bounce"
        >
          <VolumeX className="w-3.5 h-3.5" />
          <span>Tap to Enable Audio</span>
        </button>
      )}

      {/* Active Speaker Status Badge */}
      {activeSpeaker && (
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-300 text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>🔊 {activeSpeaker} Speaking</span>
        </div>
      )}

      {/* Mic Toggle Button (Available for EVERY user: Host, Viewers & Participants) */}
      <button
        onClick={toggleMic}
        className={`px-3 py-1.5 rounded-xl font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition-all ${
          isMicOn
            ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-md animate-pulse ring-2 ring-rose-400'
            : 'bg-brand-primary hover:bg-brand-primaryDark text-white'
        }`}
      >
        {isMicOn ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
        <span>{isMicOn ? 'Mute Mic' : '🎙️ Mic On'}</span>
      </button>
    </div>
  );
};
