'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  HelpCircle, CheckCircle2, XCircle, Clock, Trophy, AlertCircle, 
  User, Maximize, Lock, Unlock 
} from 'lucide-react';
import { PublicQuizState } from '@/types';

interface QuizParticipantScreenProps {
  state: PublicQuizState;
  participantId: string | null;
  nickname: string;
  onJoinQuiz: (nickname: string) => void;
  onSubmitAnswer: (optionIndex: number) => void;
}

export const QuizParticipantScreen: React.FC<QuizParticipantScreenProps> = ({
  state,
  participantId,
  nickname,
  onJoinQuiz,
  onSubmitAnswer,
}) => {
  const [nicknameInput, setNicknameInput] = useState(nickname || '');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  // Reset answer selection when question changes
  useEffect(() => {
    setSelectedOption(state.userAnswer !== undefined ? state.userAnswer : null);
    setHasSubmitted(state.userAnswer !== undefined);
  }, [state.currentQuestion, state.userAnswer]);

  // Trigger celebratory confetti if user was correct
  useEffect(() => {
    if (state.resultsRevealed && state.correctOption !== undefined && state.userAnswer === state.correctOption) {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
  }, [state.resultsRevealed, state.correctOption, state.userAnswer]);

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = nicknameInput.trim();
    if (!clean || clean.length < 2 || clean.length > 20) {
      setJoinError('Nickname must be between 2 and 20 characters.');
      return;
    }
    setJoinError(null);
    onJoinQuiz(clean);
  };

  const handleAnswerSubmit = (optionIndex: number) => {
    if (!state.answersOpen || hasSubmitted) return;
    setSelectedOption(optionIndex);
    setHasSubmitted(true);
    onSubmitAnswer(optionIndex);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Nickname Join Screen
  if (!participantId) {
    return (
      <div className="min-h-screen bg-brand-bgLight dark:bg-brand-darkBg text-slate-800 dark:text-slate-100 flex flex-col justify-center items-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-brand-darkCard border border-slate-200 dark:border-brand-darkBorder rounded-2xl p-7 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-brand-secondary text-white mx-auto flex items-center justify-center font-bold text-lg">
              QZ
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {state.title}
            </h1>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Enter your nickname to join the live quiz
            </p>
          </div>

          <form onSubmit={handleJoinSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-brand-secondary" />
                <span>Your Nickname</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Alex"
                maxLength={20}
                value={nicknameInput}
                onChange={(e) => setNicknameInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-brand-darkBorder bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-brand-secondary transition-all"
              />
            </div>

            {joinError && (
              <p className="text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 p-2.5 rounded-lg border border-rose-200 dark:border-rose-900">
                {joinError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-brand-primary hover:bg-brand-primaryDark text-white font-bold text-sm rounded-xl transition-all"
            >
              Join Quiz
            </button>
          </form>

          <p className="text-[11px] text-slate-400 text-center">
            No registration or permanent account required.
          </p>
        </div>
      </div>
    );
  }

  const currentQ = state.currentQuestionData;
  const labels = ['A', 'B', 'C', 'D'];

  return (
    <div className="min-h-screen bg-brand-bgLight dark:bg-brand-darkBg text-slate-800 dark:text-slate-100 flex flex-col justify-between">
      
      {/* Header Bar */}
      <header className="bg-white dark:bg-brand-darkCard border-b border-slate-200 dark:border-brand-darkBorder px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-secondary text-white font-bold text-xs flex items-center justify-center">
            QZ
          </div>
          <div>
            <h1 className="text-xs sm:text-sm font-bold truncate max-w-[180px] sm:max-w-xs text-slate-900 dark:text-white">
              {state.title}
            </h1>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block">
              Participant: <strong className="text-slate-800 dark:text-slate-200">{nickname}</strong>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {state.userScore !== undefined && (
            <div className="px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 font-mono font-bold text-xs border border-purple-200 dark:border-purple-800">
              {state.userScore} pts
            </div>
          )}

          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors"
          >
            <Maximize className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Admin Disconnected Notice */}
      {!state.adminConnected && (
        <div className="bg-amber-600 text-white text-xs font-semibold py-2 px-4 text-center flex items-center justify-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Quiz host temporarily disconnected. Reconnecting...</span>
        </div>
      )}

      {/* Main Participant Screen */}
      <main className="max-w-2xl w-full mx-auto p-4 sm:p-6 flex-1 flex flex-col justify-center my-auto">
        
        {state.currentQuestion === 0 ? (
          <div className="bg-white dark:bg-brand-darkCard border border-slate-200 dark:border-brand-darkBorder rounded-2xl p-8 sm:p-10 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 mx-auto flex items-center justify-center border border-slate-200 dark:border-slate-700">
              <Clock className="w-7 h-7 animate-pulse text-brand-secondary" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Waiting for Host to Start Quiz
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              You are connected. Questions will appear on your screen once launched.
            </p>
          </div>
        ) : !currentQ ? (
          <div className="text-center p-8 text-xs text-slate-500">Loading question...</div>
        ) : (
          <div className="bg-white dark:bg-brand-darkCard border border-slate-200 dark:border-brand-darkBorder rounded-2xl p-5 sm:p-7 space-y-5">
            
            {/* Question badge */}
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs uppercase tracking-wider border border-slate-200 dark:border-slate-700">
                Question {state.currentQuestion} of {state.totalQuestions}
              </span>

              {state.answersOpen ? (
                <span className="px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-semibold text-xs border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Submissions Open</span>
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold text-xs border border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Submissions Closed</span>
                </span>
              )}
            </div>

            {/* Question Text */}
            <h2 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white leading-snug">
              {currentQ.question}
            </h2>

            {/* Options grid */}
            <div className="grid grid-cols-1 gap-2.5 pt-1">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = state.resultsRevealed && state.correctOption === idx;
                const isWrongSelection = state.resultsRevealed && isSelected && !isCorrect;

                let btnStyle = 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100';

                if (state.resultsRevealed) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-600 text-white border-emerald-600';
                  } else if (isWrongSelection) {
                    btnStyle = 'bg-rose-600 text-white border-rose-600';
                  } else {
                    btnStyle = 'bg-slate-100 dark:bg-slate-900 text-slate-400 opacity-60';
                  }
                } else if (isSelected) {
                  btnStyle = 'bg-brand-primary text-white border-brand-primary';
                }

                return (
                  <button
                    key={idx}
                    disabled={!state.answersOpen || hasSubmitted || state.resultsRevealed}
                    onClick={() => handleAnswerSubmit(idx)}
                    className={`w-full p-3.5 rounded-xl border text-left font-semibold text-xs sm:text-sm flex items-center justify-between gap-3 transition-all ${btnStyle} ${
                      state.answersOpen && !hasSubmitted ? 'hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer' : 'cursor-default'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-7 h-7 rounded-lg font-mono font-bold text-xs flex items-center justify-center shrink-0 ${
                        isSelected || (state.resultsRevealed && (isCorrect || isWrongSelection))
                          ? 'bg-white/20 text-white'
                          : 'bg-brand-primary text-white'
                      }`}>
                        {labels[idx]}
                      </span>
                      <span>{option}</span>
                    </div>

                    {state.resultsRevealed && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
                    )}
                    {state.resultsRevealed && isWrongSelection && (
                      <XCircle className="w-5 h-5 text-white shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Status Feedback */}
            {hasSubmitted && !state.resultsRevealed && (
              <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-center space-y-0.5">
                <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Answer Submitted Successfully</span>
                </p>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400">
                  Waiting for host to reveal results...
                </p>
              </div>
            )}

            {state.resultsRevealed && (
              <div className={`p-3.5 rounded-xl border text-center ${
                selectedOption === state.correctOption
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-800 dark:text-emerald-200'
                  : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 text-rose-800 dark:text-rose-200'
              }`}>
                <p className="text-xs font-bold flex items-center justify-center gap-1.5">
                  {selectedOption === state.correctOption ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Correct! +10 Points</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-rose-600" />
                      <span>Incorrect Response</span>
                    </>
                  )}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Leaderboard Overlay */}
        {state.leaderboardVisible && state.leaderboard && (
          <div className="mt-5 bg-white dark:bg-brand-darkCard border border-purple-200 dark:border-purple-900/50 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Leaderboard Standings
              </h3>
            </div>

            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {state.leaderboard.map((item) => (
                <div
                  key={item.nickname}
                  className={`flex items-center justify-between p-2.5 rounded-lg border text-xs ${
                    item.nickname === nickname
                      ? 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 font-bold'
                      : 'bg-slate-50 dark:bg-slate-900/60 border-slate-100 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-purple-600 text-white font-bold text-[10px] flex items-center justify-center">
                      #{item.rank}
                    </span>
                    <span>{item.nickname}</span>
                  </div>
                  <span className="font-mono font-bold">{item.score} pts</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="text-center py-3 text-[11px] text-slate-400 font-medium">
        LiveControl Real-Time Quiz Session
      </footer>
    </div>
  );
};
