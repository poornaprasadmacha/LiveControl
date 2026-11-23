'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { socket } from '@/lib/socket';
import { PublicRoomState, PublicPresentationState, PublicQuizState } from '@/types';
import { PresentationViewerScreen } from '@/components/presentation/PresentationViewerScreen';
import { QuizParticipantScreen } from '@/components/quiz/QuizParticipantScreen';
import { AlertCircle, RefreshCw, Radio } from 'lucide-react';
import Link from 'next/link';

export default function RoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = (params.roomId as string)?.toUpperCase();

  const [roomState, setRoomState] = useState<PublicRoomState | null>(null);
  const [participantId, setParticipantId] = useState<string | null>(null);
  const [nickname, setNickname] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSessionEnded, setIsSessionEnded] = useState(false);
  const lastSlideSeqRef = useRef<number>(0);

  useEffect(() => {
    if (!roomId) return;

    if (!socket.connected) {
      socket.connect();
    }

    const handleConnect = () => {
      setIsConnected(true);
      setError(null);

      socket.emit('joinRoom', { roomId, role: 'VIEWER' }, (res) => {
        if (res.success && res.state) {
          setRoomState(res.state);
        } else if (res.error && res.error.includes('Invalid room type for viewer')) {
          // Quiz room: Nickname prompt will render
        } else {
          setError(res.error || 'Room not found.');
        }
      });
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    const handleRoomState = (state: PublicRoomState) => {
      setRoomState(state);
    };

    const handleSlideChanged = (data: { currentSlide: number; isBlank: boolean; seq?: number }) => {
      // Discard any out-of-order stale packet to guarantee monotonic sequence
      if (data.seq && data.seq < lastSlideSeqRef.current) {
        return;
      }
      if (data.seq) {
        lastSlideSeqRef.current = data.seq;
      }
      setRoomState((prev) => {
        if (!prev || prev.type !== 'presentation') return prev;
        return {
          ...prev,
          currentSlide: data.currentSlide,
          isBlank: data.isBlank,
        };
      });
    };

    const handleAdminStatusChanged = (data: { connected: boolean }) => {
      setRoomState((prev) => {
        if (!prev) return prev;
        return { ...prev, adminConnected: data.connected };
      });
    };

    const handleViewerCountUpdated = (data: { count: number }) => {
      setRoomState((prev) => {
        if (!prev || prev.type !== 'presentation') return prev;
        return { ...prev, viewerCount: data.count };
      });
    };

    const handleParticipantCountUpdated = (data: { count: number }) => {
      setRoomState((prev) => {
        if (!prev || prev.type !== 'quiz') return prev;
        return { ...prev, participantCount: data.count };
      });
    };

    const handleScreenShareStarted = (data: { adminSocketId: string }) => {
      setRoomState((prev) => {
        if (!prev || prev.type !== 'presentation') return prev;
        return {
          ...prev,
          isScreenSharing: true,
          screenShareSocketId: data.adminSocketId,
        };
      });
    };

    const handleScreenShareStopped = () => {
      setRoomState((prev) => {
        if (!prev || prev.type !== 'presentation') return prev;
        return {
          ...prev,
          isScreenSharing: false,
          screenShareSocketId: null,
        };
      });
    };

    const handleSessionEnded = () => {
      setIsSessionEnded(true);
      socket.disconnect();
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('roomState', handleRoomState);
    socket.on('slideChanged', handleSlideChanged);
    socket.on('adminStatusChanged', handleAdminStatusChanged);
    socket.on('viewerCountUpdated', handleViewerCountUpdated);
    socket.on('participantCountUpdated', handleParticipantCountUpdated);
    socket.on('screenShareStarted', handleScreenShareStarted);
    socket.on('screenShareStopped', handleScreenShareStopped);
    socket.on('sessionEnded', handleSessionEnded);

    if (socket.connected) {
      handleConnect();
    }

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('roomState', handleRoomState);
      socket.off('slideChanged', handleSlideChanged);
      socket.off('adminStatusChanged', handleAdminStatusChanged);
      socket.off('viewerCountUpdated', handleViewerCountUpdated);
      socket.off('participantCountUpdated', handleParticipantCountUpdated);
      socket.off('screenShareStarted', handleScreenShareStarted);
      socket.off('screenShareStopped', handleScreenShareStopped);
      socket.off('sessionEnded', handleSessionEnded);
    };
  }, [roomId]);

  const handleJoinQuiz = (enteredNickname: string) => {
    setNickname(enteredNickname);
    socket.emit(
      'joinRoom',
      { roomId, role: 'PARTICIPANT', nickname: enteredNickname, participantId: participantId || undefined },
      (res) => {
        if (res.success && res.state && res.participantId) {
          setParticipantId(res.participantId);
          setRoomState(res.state);
        } else {
          setError(res.error || 'Could not join quiz.');
        }
      }
    );
  };

  const handleSubmitAnswer = (optionIndex: number) => {
    if (!participantId || !roomState || roomState.type !== 'quiz') return;

    socket.emit(
      'submitAnswer',
      {
        roomId,
        participantId,
        questionIndex: roomState.currentQuestion,
        optionIndex,
      },
      (res) => {
        if (!res.success && res.error) {
          console.warn('Answer submission warning:', res.error);
        }
      }
    );
  };

  // 1. Session Ended View
  if (isSessionEnded) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-800 mx-auto flex items-center justify-center border border-slate-200">
            <Radio className="w-8 h-8 text-emerald-800" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold text-slate-900">
              Session Has Ended
            </h1>
            <p className="text-sm font-medium text-slate-600">
              The host has ended this live room. All active session data was cleared.
            </p>
          </div>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-blue-900 text-white font-extrabold text-sm rounded-xl hover:bg-blue-800 transition-all"
          >
            Return to Home Page
          </Link>
        </div>
      </div>
    );
  }

  // 2. Error View
  if (error) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-white border border-rose-200 rounded-2xl p-8 text-center space-y-6">
          <AlertCircle className="w-12 h-12 text-rose-600 mx-auto" />
          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold text-slate-900">
              Unable to Join Room
            </h1>
            <p className="text-sm font-bold text-rose-700">
              {error}
            </p>
          </div>
          <Link
            href="/join"
            className="inline-block px-6 py-3 bg-blue-900 text-white font-extrabold text-sm rounded-xl"
          >
            Try Another Room Code
          </Link>
        </div>
      </div>
    );
  }

  // 3. Loading / Connecting View
  if (!roomState) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 font-sans">
        <div className="flex items-center gap-3 text-slate-700 text-base font-bold">
          <RefreshCw className="w-5 h-5 animate-spin text-blue-900" />
          <span>Connecting to Room {roomId}...</span>
        </div>
      </div>
    );
  }

  // 4. Presentation Viewer (No header and footer)
  if (roomState.type === 'presentation') {
    return (
      <PresentationViewerScreen
        state={roomState as PublicPresentationState}
        isConnected={isConnected}
      />
    );
  }

  // 5. Quiz Participant Screen
  return (
    <QuizParticipantScreen
      state={roomState as PublicQuizState}
      participantId={participantId}
      nickname={nickname}
      onJoinQuiz={handleJoinQuiz}
      onSubmitAnswer={handleSubmitAnswer}
    />
  );
}
