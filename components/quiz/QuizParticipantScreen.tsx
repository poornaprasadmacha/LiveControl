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
      <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col justify-center items-center p-4 font-sans">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-emerald-800 text-white mx-auto flex items-center justify-center font-extrabold text-xl">
              QZ
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              {state.title}
            </h1>
            <p className="text-sm font-semibold text-slate-600">
              Enter your nickname to join the live quiz
            </p>
          </div>

          <form onSubmit={handleJoinSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <User className="w-4 h-4 text-emerald-700" />
                <span>Your Nickname</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Alex"
                maxLength={20}
                value={nicknameInput}
                onChange={(e) => setNicknameInput(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-bold text-base focus:outline-none focus:ring-2 focus:ring-emerald-700 transition-all"
              />
            </div>

            {joinError && (
              <p className="text-xs font-bold text-rose-700 bg-rose-50 p-3 rounded-lg border border-rose-200">
                {joinError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-4 bg-blue-900 hover:bg-blue-800 text-white font-extrabold text-base rounded-xl transition-all"
            >
              Join Quiz
            </button>
          </form>

          <p className="text-xs text-slate-500 text-center font-medium">
            No registration or account needed.
          </p>
        </div>
      </div>
    );
  }

  const currentQ = state.currentQuestionData;
  const labels = ['A', 'B', 'C', 'D'];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col justify-between font-sans">
      
      {/* Header Bar */}
      <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white font-extrabold text-xs flex items-center justify-center">
            QZ
          </div>
          <div>
            <h1 className="text-xs sm:text-sm font-bold truncate max-w-[180px] sm:max-w-xs text-slate-900">
              {state.title}
            </h1>
            <span className="text-xs text-slate-500 font-medium block">
              Participant: <strong className="text-slate-900">{nickname}</strong>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {state.userScore !== undefined && (
            <div className="px-3 py-1 rounded-lg bg-purple-50 text-purple-900 font-mono font-extrabold text-xs sm:text-sm border border-purple-200">
              {state.userScore} pts
            </div>
          )}

          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <Maximize className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Admin Disconnected Notice */}
      {!state.adminConnected && (
        <div className="bg-amber-500 text-white text-xs sm:text-sm font-bold py-2.5 px-4 text-center flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>Quiz host temporarily disconnected. Reconnecting...</span>
        </div>
      )}

      {/* Main Participant Screen with Extra Size */}
      <main className="max-w-2xl w-full mx-auto p-4 sm:p-6 flex-1 flex flex-col justify-center my-auto">
        
        {state.currentQuestion === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-800 mx-auto flex items-center justify-center border border-slate-200">
              <Clock className="w-8 h-8 animate-pulse text-emerald-700" />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Waiting for Host to Launch Quiz
            </h2>
            <p className="text-sm text-slate-600 font-medium">
              You are connected. Questions will appear on your screen once started.
            </p>
          </div>
        ) : !currentQ ? (
          <div className="text-center p-8 text-sm text-slate-500">Loading question...</div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
            
            {/* Question badge */}
            <div className="flex items-center justify-between">
              <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 font-extrabold text-xs sm:text-sm uppercase tracking-wider border border-slate-300">
                Question {state.currentQuestion} of {state.totalQuestions}
              </span>

              {state.answersOpen ? (
                <span className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 font-bold text-xs sm:text-sm border border-emerald-300 flex items-center gap-1.5">
                  <Unlock className="w-4 h-4" />
                  <span>Submissions Open</span>
                </span>
              ) : (
                <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs sm:text-sm border border-slate-300 flex items-center gap-1.5">
                  <Lock className="w-4 h-4" />
                  <span>Submissions Closed</span>
                </span>
              )}
            </div>

            {/* Question Text with Extra Size */}
            <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900 leading-snug">
              {currentQ.question}
            </h2>

            {/* Options grid with Extra Size */}
            <div className="grid grid-cols-1 gap-3 pt-1">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = state.resultsRevealed && state.correctOption === idx;
                const isWrongSelection = state.resultsRevealed && isSelected && !isCorrect;

                let btnStyle = 'bg-slate-50 border-slate-200 text-slate-900';

                if (state.resultsRevealed) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-600 text-white border-emerald-700 font-bold';
                  } else if (isWrongSelection) {
                    btnStyle = 'bg-rose-600 text-white border-rose-700 font-bold';
                  } else {
                    btnStyle = 'bg-slate-100 text-slate-400 opacity-60';
                  }
                } else if (isSelected) {
                  btnStyle = 'bg-blue-900 text-white border-blue-900 font-bold';
                }

                return (
                  <button
                    key={idx}
                    disabled={!state.answersOpen || hasSubmitted || state.resultsRevealed}
                    onClick={() => handleAnswerSubmit(idx)}
                    className={`w-full p-4 rounded-xl border text-left font-bold text-sm sm:text-base flex items-center justify-between gap-3.5 transition-all ${btnStyle} ${
                      state.answersOpen && !hasSubmitted ? 'hover:bg-slate-100 cursor-pointer' : 'cursor-default'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <span className={`w-8 h-8 rounded-lg font-mono font-extrabold text-xs sm:text-sm flex items-center justify-center shrink-0 ${
                        isSelected || (state.resultsRevealed && (isCorrect || isWrongSelection))
                          ? 'bg-white/20 text-white'
                          : 'bg-blue-900 text-white'
                      }`}>
                        {labels[idx]}
                      </span>
                      <span className="leading-snug">{option}</span>
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
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-1">
                <p className="text-sm font-extrabold text-emerald-800 flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Answer Submitted Successfully</span>
                </p>
                <p className="text-xs text-emerald-700 font-medium">
                  Waiting for host to reveal results...
                </p>
              </div>
            )}

            {state.resultsRevealed && (
              <div className={`p-4 rounded-xl border text-center ${
                selectedOption === state.correctOption
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-rose-50 border-rose-300 text-rose-900'
              }`}>
                <p className="text-sm sm:text-base font-extrabold flex items-center justify-center gap-2">
                  {selectedOption === state.correctOption ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                      <span>Correct! +10 Points</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-rose-700" />
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
          <div className="mt-6 bg-white border border-purple-200 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2.5">
              <Trophy className="w-6 h-6 text-purple-700" />
              <h3 className="text-lg font-extrabold text-slate-900">
                Leaderboard Standings
              </h3>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {state.leaderboard.map((item) => (
                <div
                  key={item.nickname}
                  className={`flex items-center justify-between p-3 rounded-xl border text-sm ${
                    item.nickname === nickname
                      ? 'bg-blue-50 border-blue-400 font-extrabold text-blue-950'
                      : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-md bg-purple-700 text-white font-extrabold text-xs flex items-center justify-center">
                      #{item.rank}
                    </span>
                    <span>{item.nickname}</span>
                  </div>
                  <span className="font-mono font-extrabold">{item.score} pts</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="text-center py-4 text-xs text-slate-500 font-medium">
        LiveControl Real-Time Quiz Session
      </footer>
    </div>
  );
};
