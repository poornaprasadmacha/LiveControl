'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  HelpCircle, CheckCircle2, XCircle, Clock, Trophy, AlertCircle, 
  Send, Sparkles, User, Maximize 
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

  // Trigger celebratory confetti if user was correct!
  useEffect(() => {
    if (state.resultsRevealed && state.correctOption !== undefined && state.userAnswer === state.correctOption) {
      confetti({
        particleCount: 80,
        spread: 70,
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

  // Requirement 27: Nickname Join Screen
  if (!participantId) {
    return (
      <div className="min-h-screen bg-brand-bgLight dark:bg-brand-darkBg text-slate-900 dark:text-white flex flex-col justify-center items-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-brand-darkCard border border-sky-100 dark:border-brand-darkBorder rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-brand-secondary text-white mx-auto flex items-center justify-center font-black text-xl shadow-lg">
              QZ
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              {state.title}
            </h1>
            <p className="text-xs font-semibold text-brand-primary dark:text-brand-light">
              Enter your nickname to join the live quiz
            </p>
          </div>

          <form onSubmit={handleJoinSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <User className="w-4 h-4 text-brand-secondary" />
                <span>Your Nickname</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Poorna"
                maxLength={20}
                value={nicknameInput}
                onChange={(e) => setNicknameInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-brand-darkBorder bg-slate-50 dark:bg-brand-darkBg text-slate-900 dark:text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-brand-secondary transition-all"
              />
            </div>

            {joinError && (
              <p className="text-xs font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/40 p-2.5 rounded-lg border border-rose-200">
                {joinError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-brand-primary hover:bg-brand-primaryDark text-white font-black text-sm rounded-xl shadow-lg hover:shadow-xl transition-all"
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
    <div className="min-h-screen bg-brand-bgLight dark:bg-brand-darkBg text-slate-900 dark:text-white flex flex-col justify-between">
      
      {/* Header Bar */}
      <header className="bg-white dark:bg-brand-darkCard border-b border-sky-100 dark:border-brand-darkBorder px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-secondary text-white font-black text-xs flex items-center justify-center">
            QZ
          </div>
          <div>
            <h1 className="text-xs sm:text-sm font-extrabold truncate max-w-[180px] sm:max-w-xs">
              {state.title}
            </h1>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block">
              Participant: <strong className="text-brand-primary dark:text-brand-light">{nickname}</strong>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {state.userScore !== undefined && (
            <div className="px-3 py-1 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 font-mono font-black text-xs border border-purple-200">
              {state.userScore} pts
            </div>
          )}

          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-brand-darkBg text-slate-600 dark:text-slate-300"
          >
            <Maximize className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Admin Disconnected Notice */}
      {!state.adminConnected && (
        <div className="bg-amber-500 text-white text-xs font-bold py-2 px-4 text-center animate-pulse">
          ⚠️ Quiz host temporarily disconnected. Please wait...
        </div>
      )}

      {/* Main Participant Screen */}
      <main className="max-w-2xl w-full mx-auto p-4 sm:p-6 flex-1 flex flex-col justify-center my-auto">
        
        {state.currentQuestion === 0 ? (
          <div className="bg-white dark:bg-brand-darkCard border border-sky-100 dark:border-brand-darkBorder rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-xl">
            <div className="w-16 h-16 rounded-2xl bg-brand-light/50 dark:bg-brand-secondary/20 text-brand-primary dark:text-brand-light mx-auto flex items-center justify-center">
              <Clock className="w-8 h-8 animate-pulse" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Waiting for Host to Start Quiz
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              You are connected! Questions will appear on your screen as soon as the host launches the quiz.
            </p>
          </div>
        ) : !currentQ ? (
          <div className="text-center p-8">Loading question...</div>
        ) : (
          <div className="bg-white dark:bg-brand-darkCard border border-sky-100 dark:border-brand-darkBorder rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            
            {/* Header: Question badge */}
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-brand-light/60 dark:bg-brand-secondary/30 text-brand-primary dark:text-brand-light font-black text-xs uppercase tracking-wider">
                Question {state.currentQuestion} of {state.totalQuestions}
              </span>

              {state.answersOpen ? (
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 font-bold text-xs border border-emerald-200 animate-pulse">
                  🟢 Submissions Open
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 font-bold text-xs border border-slate-200">
                  🔒 Submissions Closed
                </span>
              )}
            </div>

            {/* Question Text */}
            <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-snug">
              {currentQ.question}
            </h2>

            {/* Options grid with large touch buttons */}
            <div className="grid grid-cols-1 gap-3 pt-2">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = state.resultsRevealed && state.correctOption === idx;
                const isWrongSelection = state.resultsRevealed && isSelected && !isCorrect;

                let btnStyle = 'bg-slate-50 dark:bg-brand-darkBg border-slate-200 dark:border-brand-darkBorder text-slate-800 dark:text-slate-100';

                if (state.resultsRevealed) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-500 text-white border-emerald-600 shadow-lg ring-2 ring-emerald-400';
                  } else if (isWrongSelection) {
                    btnStyle = 'bg-rose-500 text-white border-rose-600';
                  } else {
                    btnStyle = 'bg-slate-100 dark:bg-brand-darkBg text-slate-400 opacity-60';
                  }
                } else if (isSelected) {
                  btnStyle = 'bg-brand-primary text-white border-brand-primary shadow-lg ring-2 ring-brand-primary';
                }

                return (
                  <button
                    key={idx}
                    disabled={!state.answersOpen || hasSubmitted || state.resultsRevealed}
                    onClick={() => handleAnswerSubmit(idx)}
                    className={`w-full p-4 rounded-2xl border text-left font-extrabold text-sm sm:text-base flex items-center justify-between gap-4 transition-all ${btnStyle} ${
                      state.answersOpen && !hasSubmitted ? 'hover:scale-[1.01] active:scale-[0.99] cursor-pointer' : 'cursor-default'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-xl font-mono font-black text-xs flex items-center justify-center shrink-0 ${
                        isSelected || (state.resultsRevealed && (isCorrect || isWrongSelection))
                          ? 'bg-white/20 text-white'
                          : 'bg-brand-primary text-white'
                      }`}>
                        {labels[idx]}
                      </span>
                      <span>{option}</span>
                    </div>

                    {state.resultsRevealed && isCorrect && (
                      <CheckCircle2 className="w-6 h-6 text-white shrink-0" />
                    )}
                    {state.resultsRevealed && isWrongSelection && (
                      <XCircle className="w-6 h-6 text-white shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Status Footer Feedback */}
            {hasSubmitted && !state.resultsRevealed && (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-center space-y-1">
                <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Answer Submitted Successfully!</span>
                </p>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400">
                  Waiting for host to close submissions and reveal results...
                </p>
              </div>
            )}

            {state.resultsRevealed && (
              <div className={`p-4 rounded-2xl border text-center space-y-1 ${
                selectedOption === state.correctOption
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-800 dark:text-emerald-200'
                  : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 text-rose-800 dark:text-rose-200'
              }`}>
                <p className="text-sm font-black">
                  {selectedOption === state.correctOption ? '🎉 Correct! +10 Points!' : '❌ Incorrect!'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Leaderboard Overlay when visible */}
        {state.leaderboardVisible && state.leaderboard && (
          <div className="mt-6 bg-white dark:bg-brand-darkCard border border-purple-200 dark:border-purple-900 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-amber-500" />
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Leaderboard Standings
              </h3>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {state.leaderboard.map((item) => (
                <div
                  key={item.nickname}
                  className={`flex items-center justify-between p-3 rounded-xl border text-xs ${
                    item.nickname === nickname
                      ? 'bg-brand-light/60 dark:bg-brand-secondary/30 border-brand-primary font-black'
                      : 'bg-slate-50 dark:bg-brand-darkBg border-slate-100 dark:border-brand-darkBorder'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-purple-600 text-white font-bold text-[10px] flex items-center justify-center">
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
