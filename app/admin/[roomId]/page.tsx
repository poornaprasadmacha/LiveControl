'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { socket } from '@/lib/socket';
import { PublicRoomState, PublicPresentationState, PublicQuizState } from '@/types';
import { PresentationAdminDashboard } from '@/components/admin/PresentationAdminDashboard';
import { QuizAdminDashboard } from '@/components/admin/QuizAdminDashboard';
import { Lock, ShieldCheck, AlertCircle, RefreshCw, KeyRound, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = (params.roomId as string)?.toUpperCase();

  const [pinInput, setPinInput] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [roomState, setRoomState] = useState<PublicRoomState | null>(null);
  const [liveAnswerData, setLiveAnswerData] = useState<
    { answeredCount: number; totalCount: number; distribution: Record<number, number> } | undefined
  >();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    if (!roomId) return;

    if (!socket.connected) {
      socket.connect();
    }

    const savedToken = sessionStorage.getItem(`lc_admin_token_${roomId}`);

    const handleConnect = () => {
      if (savedToken) {
        attemptTokenAuth(savedToken);
      }
    };

    const handleRoomState = (state: PublicRoomState) => {
      setRoomState(state);
    };

    const handleLiveAnswerUpdate = (data: { answeredCount: number; totalCount: number; distribution: Record<number, number> }) => {
      setLiveAnswerData(data);
    };

    socket.on('connect', handleConnect);
    socket.on('roomState', handleRoomState);
    socket.on('liveAnswerUpdate', handleLiveAnswerUpdate);

    if (socket.connected && savedToken) {
      attemptTokenAuth(savedToken);
    }

    return () => {
      socket.off('connect', handleConnect);
      socket.off('roomState', handleRoomState);
      socket.off('liveAnswerUpdate', handleLiveAnswerUpdate);
    };
  }, [roomId]);

  const attemptTokenAuth = (tokenToVerify: string) => {
    socket.emit('joinRoom', { roomId, role: 'ADMIN', token: tokenToVerify }, (res) => {
      if (res.success && res.state) {
        setToken(tokenToVerify);
        setIsAuthenticated(true);
        setRoomState(res.state);
        setAuthError(null);
      } else {
        sessionStorage.removeItem(`lc_admin_token_${roomId}`);
        setIsAuthenticated(false);
      }
    });
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinInput.trim()) return;

    setIsAuthenticating(true);
    setAuthError(null);

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit('adminAuthenticate', { roomId, pin: pinInput.trim() }, (res) => {
      setIsAuthenticating(false);
      if (res.success && res.token) {
        sessionStorage.setItem(`lc_admin_token_${roomId}`, res.token);
        setToken(res.token);
        setIsAuthenticated(true);

        // Fetch room state
        socket.emit('joinRoom', { roomId, role: 'ADMIN', token: res.token }, (joinRes) => {
          if (joinRes.success && joinRes.state) {
            setRoomState(joinRes.state);
          }
        });
      } else {
        setAuthError(res.error || 'Authentication failed.');
      }
    });
  };

  // Action Handlers
  const handleSlideChange = (slideIndex: number, isBlank?: boolean) => {
    if (!token) return;
    socket.emit('changeSlide', { roomId, slideIndex, isBlank, token });
  };

  const handleToggleBlank = () => {
    if (!token) return;
    socket.emit('toggleBlank', { roomId, token });
  };

  const handleStartQuiz = () => {
    if (!token) return;
    socket.emit('startQuiz', { roomId, token });
  };

  const handleChangeQuestion = (questionIndex: number) => {
    if (!token) return;
    socket.emit('changeQuestion', { roomId, questionIndex, token });
  };

  const handleOpenAnswers = (durationSeconds?: number) => {
    if (!token) return;
    socket.emit('openAnswers', { roomId, durationSeconds, token });
  };

  const handleCloseAnswers = () => {
    if (!token) return;
    socket.emit('closeAnswers', { roomId, token });
  };

  const handleRevealResults = () => {
    if (!token) return;
    socket.emit('revealResults', { roomId, token });
  };

  const handleShowLeaderboard = () => {
    if (!token) return;
    socket.emit('showLeaderboard', { roomId, token });
  };

  const handleDownloadResults = () => {
    if (typeof window !== 'undefined') {
      const socketServerUrl = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || 'http://localhost:3001';
      window.open(`${socketServerUrl}/api/download-results/${roomId}`, '_blank');
    }
  };

  const handleEndSession = () => {
    if (!token) return;
    socket.emit('endSession', { roomId, token }, (res) => {
      if (res && res.success) {
        sessionStorage.removeItem(`lc_admin_token_${roomId}`);
        router.push('/?message=Session+ended+and+deleted+successfully.');
      }
    });
  };

  // 1. PIN Auth Prompt Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-brand-bgLight dark:bg-brand-darkBg flex flex-col justify-center items-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-brand-darkCard border border-sky-100 dark:border-brand-darkBorder rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-brand-primary text-white mx-auto flex items-center justify-center shadow-lg">
              <KeyRound className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              Host Authentication
            </h1>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Enter Admin PIN to control room <strong className="font-mono text-brand-primary dark:text-brand-light">{roomId}</strong>
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Admin Security PIN
              </label>
              <input
                type="password"
                required
                placeholder="Enter PIN"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-brand-darkBorder bg-slate-50 dark:bg-brand-darkBg text-slate-900 dark:text-white font-mono font-bold text-center text-lg focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all"
              />
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-600 dark:text-rose-400 text-xs font-bold text-center">
                {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full py-4 bg-brand-primary hover:bg-brand-primaryDark text-white font-black text-sm rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isAuthenticating ? (
                <span>Verifying PIN...</span>
              ) : (
                <>
                  <span>Authenticate & Open Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-[11px] text-slate-400 text-center">
            Server-side authentication protects host controls from unauthorized viewers.
          </p>
        </div>
      </div>
    );
  }

  // 2. Loading State
  if (!roomState) {
    return (
      <div className="min-h-screen bg-brand-bgLight dark:bg-brand-darkBg flex items-center justify-center p-4">
        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300 text-sm font-bold">
          <RefreshCw className="w-5 h-5 animate-spin text-brand-primary" />
          <span>Loading Dashboard State...</span>
        </div>
      </div>
    );
  }

  // 3. Presentation Admin Dashboard
  if (roomState.type === 'presentation') {
    return (
      <PresentationAdminDashboard
        state={roomState as PublicPresentationState}
        onSlideChange={handleSlideChange}
        onToggleBlank={handleToggleBlank}
        onEndSession={handleEndSession}
      />
    );
  }

  // 4. Quiz Admin Dashboard
  return (
    <QuizAdminDashboard
      state={roomState as PublicQuizState}
      liveAnswerData={liveAnswerData}
      onStartQuiz={handleStartQuiz}
      onChangeQuestion={handleChangeQuestion}
      onOpenAnswers={handleOpenAnswers}
      onCloseAnswers={handleCloseAnswers}
      onRevealResults={handleRevealResults}
      onShowLeaderboard={handleShowLeaderboard}
      onDownloadResults={handleDownloadResults}
      onEndSession={handleEndSession}
    />
  );
}
