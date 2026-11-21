'use client';

import React, { useEffect, useState } from 'react';
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

    const handleSlideChanged = (data: { currentSlide: number; isBlank: boolean }) => {
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
      <div className="min-h-screen bg-brand-bgLight dark:bg-brand-darkBg flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-brand-darkCard border border-slate-200 dark:border-brand-darkBorder rounded-2xl p-7 text-center space-y-5">
          <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 mx-auto flex items-center justify-center border border-slate-200 dark:border-slate-700">
            <Radio className="w-6 h-6 text-brand-secondary" />
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Session Has Ended
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              The host has ended this live room. All active session data was cleared.
            </p>
          </div>
          <Link
            href="/"
            className="inline-block px-5 py-2.5 bg-brand-primary text-white font-bold text-xs rounded-xl hover:bg-brand-primaryDark transition-all"
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
      <div className="min-h-screen bg-brand-bgLight dark:bg-brand-darkBg flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-brand-darkCard border border-rose-200 dark:border-rose-900/60 rounded-2xl p-7 text-center space-y-5">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
          <div className="space-y-1">
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">
              Unable to Join Room
            </h1>
            <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">
              {error}
            </p>
          </div>
          <Link
            href="/join"
            className="inline-block px-5 py-2.5 bg-brand-primary text-white font-bold text-xs rounded-xl"
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
      <div className="min-h-screen bg-brand-bgLight dark:bg-brand-darkBg flex flex-col items-center justify-center p-4">
        <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300 text-xs font-bold">
          <RefreshCw className="w-4 h-4 animate-spin text-brand-primary" />
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
