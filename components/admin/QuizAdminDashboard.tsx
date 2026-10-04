'use client';

import React, { useState } from 'react';
import { SAMPLE_QUIZ_QUESTIONS } from '@/lib/sampleQuiz';
import { EndSessionModal } from './EndSessionModal';
import { ShareModal } from '../shared/ShareModal';
import { VoiceControl } from '../shared/VoiceControl';
import { 
  Play, ChevronLeft, ChevronRight, Unlock, Lock, Eye, Trophy, Download, 
  Trash2, Share2, Users, Timer, CheckCircle, HelpCircle, BarChart2, Sparkles 
} from 'lucide-react';
import { PublicQuizState } from '@/types';

interface QuizAdminDashboardProps {
  state: PublicQuizState;
  liveAnswerData?: { answeredCount: number; totalCount: number; distribution: Record<number, number> };
  onStartQuiz: () => void;
  onChangeQuestion: (questionIndex: number) => void;
  onOpenAnswers: (durationSeconds?: number) => void;
  onCloseAnswers: () => void;
  onRevealResults: () => void;
  onShowLeaderboard: () => void;
  onDownloadResults: () => void;
  onEndSession: () => void;
}

export const QuizAdminDashboard: React.FC<QuizAdminDashboardProps> = ({
  state,
  liveAnswerData,
  onStartQuiz,
  onChangeQuestion,
  onOpenAnswers,
  onCloseAnswers,
  onRevealResults,
  onShowLeaderboard,
  onDownloadResults,
  onEndSession,
}) => {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isEndModalOpen, setIsEndModalOpen] = useState(false);
  const [timerPreset, setTimerPreset] = useState<number>(30);

  const currentQIndex = state.currentQuestion;
  const totalQuestions = SAMPLE_QUIZ_QUESTIONS.length;
  const currentQ = currentQIndex > 0 ? SAMPLE_QUIZ_QUESTIONS[currentQIndex - 1] : null;

  const distribution = liveAnswerData?.distribution || state.answerStats || { 0: 0, 1: 0, 2: 0, 3: 0 };
  const totalAnswered = liveAnswerData?.answeredCount || Object.values(distribution).reduce((a, b) => a + b, 0);

  const handlePrevQ = () => {
    if (currentQIndex > 1) {
      onChangeQuestion(currentQIndex - 1);
    }
  };

  const handleNextQ = () => {
    if (currentQIndex < totalQuestions) {
      onChangeQuestion(currentQIndex + 1);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-brand-darkBg text-slate-900 dark:text-white flex flex-col justify-between">
      
      {/* Top Header */}
      <header className="bg-white dark:bg-brand-darkCard border-b border-sky-100 dark:border-brand-darkBorder px-4 sm:px-8 py-3 sticky top-0 z-30 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-brand-secondary text-white flex items-center justify-center font-black text-base shadow-md">
            QZ
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                Quiz Host Control
              </span>
              <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-teal-50 dark:bg-brand-darkBg text-brand-secondary dark:text-teal-400 font-bold">
                {state.id}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {state.title}
            </p>
          </div>
        </div>

        {/* Status Indicators & Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>🟢 LIVE</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-brand-darkBg text-slate-700 dark:text-slate-200 text-xs font-bold border border-teal-100 dark:border-brand-darkBorder">
            <Users className="w-4 h-4 text-brand-secondary" />
            <span>👥 {state.participantCount} Participants</span>
          </div>

          {/* Real-time Voice Share Widget */}
          <VoiceControl roomId={state.id} role="ADMIN" />

          <button
            onClick={() => setIsShareOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-brand-secondary hover:bg-brand-secondaryDark text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>🔗 Share</span>
          </button>

          {/* Download Results CSV */}
          <button
            onClick={onDownloadResults}
            className="px-3.5 py-1.5 rounded-xl bg-sky-100 dark:bg-brand-darkBg hover:bg-sky-200 text-brand-primary dark:text-brand-light text-xs font-bold flex items-center gap-1.5 border border-sky-200 dark:border-brand-darkBorder transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV</span>
          </button>

          {/* Highly visible END & DELETE QUIZ button */}
          <button
            onClick={() => setIsEndModalOpen(true)}
            className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all"
          >
            <Trash2 className="w-4 h-4" />
            <span>END & DELETE QUIZ</span>
          </button>
        </div>
      </header>

      {/* Control Action Toolbar */}
      <div className="bg-white dark:bg-brand-darkCard border-b border-sky-100 dark:border-brand-darkBorder px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex flex-wrap items-center gap-2">
            {currentQIndex === 0 ? (
              <button
                onClick={onStartQuiz}
                className="px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primaryDark text-white font-extrabold text-xs flex items-center gap-2 shadow-lg transition-all"
              >
                <Play className="w-4 h-4" />
                <span>Start Quiz Session</span>
              </button>
            ) : (
              <>
                <button
                  onClick={handlePrevQ}
                  disabled={currentQIndex <= 1}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-brand-darkBg disabled:opacity-40 text-xs font-bold flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Prev Q</span>
                </button>

                <span className="font-mono font-extrabold text-xs text-brand-primary dark:text-brand-light px-2">
                  Q {currentQIndex} / {totalQuestions}
                </span>

                <button
                  onClick={handleNextQ}
                  disabled={currentQIndex >= totalQuestions}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-brand-darkBg disabled:opacity-40 text-xs font-bold flex items-center gap-1"
                >
                  <span>Next Q</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          {/* Answer Controls & Timers */}
          {currentQIndex > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              
              {/* Timer preset selection */}
              <div className="flex items-center bg-slate-100 dark:bg-brand-darkBg rounded-xl p-1 text-xs">
                <Timer className="w-3.5 h-3.5 text-slate-500 ml-2 mr-1" />
                {[15, 30, 60].map((sec) => (
                  <button
                    key={sec}
                    onClick={() => setTimerPreset(sec)}
                    className={`px-2 py-1 rounded-lg font-bold text-[11px] transition-colors ${
                      timerPreset === sec
                        ? 'bg-brand-primary text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    {sec}s
                  </button>
                ))}
              </div>

              {!state.answersOpen ? (
                <button
                  onClick={() => onOpenAnswers(timerPreset)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Open Answers ({timerPreset}s)</span>
                </button>
              ) : (
                <button
                  onClick={onCloseAnswers}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all animate-pulse"
                >
                  <Lock className="w-4 h-4" />
                  <span>Close Answers</span>
                </button>
              )}

              <button
                onClick={onRevealResults}
                className="px-4 py-2 rounded-xl bg-brand-secondary hover:bg-brand-secondaryDark text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
              >
                <Eye className="w-4 h-4" />
                <span>Show Results</span>
              </button>

              <button
                onClick={onShowLeaderboard}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
              >
                <Trophy className="w-4 h-4" />
                <span>Leaderboard</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Admin View */}
      <main className="max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        
        {/* Left/Center Column: Question & Live Response Distribution */}
        <div className="lg:col-span-8 space-y-6">
          
          {currentQIndex === 0 ? (
            <div className="bg-white dark:bg-brand-darkCard border border-sky-100 dark:border-brand-darkBorder rounded-3xl p-12 text-center space-y-6 shadow-sm">
              <div className="w-20 h-20 rounded-3xl bg-brand-light/40 dark:bg-brand-secondary/20 text-brand-primary dark:text-brand-light mx-auto flex items-center justify-center">
                <HelpCircle className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  Quiz Ready to Start
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  Click <strong>Start Quiz Session</strong> when all participants have joined the room.
                </p>
              </div>
              <button
                onClick={onStartQuiz}
                className="px-8 py-3.5 bg-brand-primary hover:bg-brand-primaryDark text-white font-black text-sm rounded-2xl shadow-xl transition-all"
              >
                Start Quiz Session
              </button>
            </div>
          ) : (
            <div className="bg-white dark:bg-brand-darkCard border border-sky-100 dark:border-brand-darkBorder rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-teal-50 dark:bg-brand-darkBg text-brand-secondary dark:text-teal-400 font-extrabold text-xs uppercase tracking-wider">
                  Question {currentQIndex} of {totalQuestions}
                </span>

                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  state.answersOpen
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-200 animate-pulse'
                    : state.resultsRevealed
                    ? 'bg-purple-50 text-purple-600 border-purple-200'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}>
                  {state.answersOpen ? '🔓 Answers OPEN' : state.resultsRevealed ? '✨ Results REVEALED' : '🔒 Answers CLOSED'}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                {currentQ?.question}
              </h2>

              {/* Options & Live Responses */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {currentQ?.options.map((option, idx) => {
                  const count = distribution[idx] || 0;
                  const pct = totalAnswered > 0 ? Math.round((count / totalAnswered) * 100) : 0;
                  const isCorrect = state.resultsRevealed && idx === currentQ.correctOption;

                  const labels = ['A', 'B', 'C', 'D'];

                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-2xl border transition-all relative overflow-hidden ${
                        isCorrect
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500'
                          : 'bg-slate-50 dark:bg-brand-darkBg border-slate-200 dark:border-brand-darkBorder'
                      }`}
                    >
                      {/* Response percentage bar background */}
                      <div
                        className="absolute top-0 bottom-0 left-0 bg-brand-light/30 dark:bg-brand-secondary/20 transition-all duration-500 pointer-events-none"
                        style={{ width: `${pct}%` }}
                      />

                      <div className="relative z-10 flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                            isCorrect ? 'bg-emerald-600 text-white' : 'bg-brand-primary text-white'
                          }`}>
                            {labels[idx]}
                          </span>
                          <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 pt-0.5">
                            {option}
                          </span>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="font-mono font-extrabold text-sm text-slate-900 dark:text-white block">
                            {count}
                          </span>
                          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                            {pct}%
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Correct Explanation if revealed */}
              {state.resultsRevealed && currentQ?.explanation && (
                <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-2xl border border-purple-200 dark:border-purple-900 text-xs text-purple-900 dark:text-purple-200">
                  <strong>Explanation:</strong> {currentQ.explanation}
                </div>
              )}
            </div>
          )}

          {/* Leaderboard Overlay when visible */}
          {state.leaderboardVisible && state.leaderboard && (
            <div className="bg-white dark:bg-brand-darkCard border border-purple-200 dark:border-purple-900 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
              <div className="flex items-center gap-3">
                <Trophy className="w-7 h-7 text-amber-500" />
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  Live Leaderboard
                </h3>
              </div>

              <div className="space-y-2">
                {state.leaderboard.map((item) => (
                  <div
                    key={item.nickname}
                    className={`flex items-center justify-between p-3.5 rounded-xl border ${
                      item.rank === 1
                        ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 text-amber-900 dark:text-amber-200 font-bold'
                        : item.rank === 2
                        ? 'bg-slate-100 dark:bg-slate-800 border-slate-300 text-slate-800 dark:text-slate-200'
                        : item.rank === 3
                        ? 'bg-amber-900/10 border-amber-800/30 text-amber-800 dark:text-amber-400'
                        : 'bg-white dark:bg-brand-darkBg border-slate-100 dark:border-brand-darkBorder'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-purple-600 text-white font-black text-xs flex items-center justify-center">
                        #{item.rank}
                      </span>
                      <span className="text-sm font-extrabold">{item.nickname}</span>
                    </div>
                    <span className="font-mono font-black text-sm text-brand-primary dark:text-brand-light">
                      {item.score} pts
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Participant Activity Monitor */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-brand-darkCard border border-sky-100 dark:border-brand-darkBorder rounded-3xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-brand-darkBorder pb-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <Users className="w-4 h-4 text-brand-secondary" />
                <span>Live Responses</span>
              </h3>
              <span className="font-mono text-xs font-extrabold text-brand-primary dark:text-brand-light">
                {totalAnswered} / {state.participantCount} Answered
              </span>
            </div>

            <div className="space-y-3">
              {/* Progress bar */}
              <div className="w-full bg-slate-100 dark:bg-brand-darkBg h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-brand-secondary h-full transition-all duration-500"
                  style={{
                    width: state.participantCount > 0 ? `${(totalAnswered / state.participantCount) * 100}%` : '0%',
                  }}
                />
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center">
                Responses update in real time as participants submit.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Share Modal */}
      <ShareModal
        roomId={state.id}
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />

      {/* End Session Confirmation Modal */}
      <EndSessionModal
        isOpen={isEndModalOpen}
        isQuiz={true}
        onClose={() => setIsEndModalOpen(false)}
        onConfirmEnd={onEndSession}
        onDownloadResults={onDownloadResults}
      />
    </div>
  );
};
