'use client';

import React, { useState } from 'react';
import { SAMPLE_QUIZ_QUESTIONS } from '@/lib/sampleQuiz';
import { EndSessionModal } from './EndSessionModal';
import { ShareModal } from '../shared/ShareModal';
import { 
  Play, ChevronLeft, ChevronRight, Unlock, Lock, Eye, Trophy, Download, 
  Trash2, Share2, Users, Timer, HelpCircle, Sparkles 
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
    <div className="min-h-screen bg-brand-bgLight dark:bg-brand-darkBg text-slate-800 dark:text-slate-100 flex flex-col justify-between">
      
      {/* Top Header */}
      <header className="bg-white dark:bg-brand-darkCard border-b border-slate-200 dark:border-brand-darkBorder px-4 sm:px-8 py-3 sticky top-0 z-30 flex flex-wrap items-center justify-between gap-4">
        
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-secondary text-white flex items-center justify-center font-bold text-sm">
            QZ
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white">
                Quiz Host Control
              </span>
              <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border border-slate-200 dark:border-slate-700">
                {state.id}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {state.title}
            </p>
          </div>
        </div>

        {/* Status Indicators & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>LIVE</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-700">
            <Users className="w-3.5 h-3.5 text-brand-secondary" />
            <span>{state.participantCount} Participants</span>
          </div>

          <button
            onClick={() => setIsShareOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>

          {/* Download Results CSV */}
          <button
            onClick={onDownloadResults}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV</span>
          </button>

          {/* END & DELETE QUIZ button */}
          <button
            onClick={() => setIsEndModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>End Quiz</span>
          </button>
        </div>
      </header>

      {/* Control Action Toolbar */}
      <div className="bg-white dark:bg-brand-darkCard border-b border-slate-200 dark:border-brand-darkBorder px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex flex-wrap items-center gap-2">
            {currentQIndex === 0 ? (
              <button
                onClick={onStartQuiz}
                className="px-4 py-2 rounded-xl bg-brand-primary hover:bg-brand-primaryDark text-white font-bold text-xs flex items-center gap-2 transition-all"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Start Quiz Session</span>
              </button>
            ) : (
              <>
                <button
                  onClick={handlePrevQ}
                  disabled={currentQIndex <= 1}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 disabled:opacity-40 text-xs font-bold flex items-center gap-1 border border-slate-200 dark:border-slate-700"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Prev</span>
                </button>

                <span className="font-mono font-bold text-xs text-slate-800 dark:text-slate-200 px-2">
                  Q {currentQIndex} / {totalQuestions}
                </span>

                <button
                  onClick={handleNextQ}
                  disabled={currentQIndex >= totalQuestions}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 disabled:opacity-40 text-xs font-bold flex items-center gap-1 border border-slate-200 dark:border-slate-700"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          {/* Answer Controls & Timers */}
          {currentQIndex > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              
              {/* Timer preset selection */}
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-1 text-xs">
                <Timer className="w-3.5 h-3.5 text-slate-500 ml-2 mr-1" />
                {[15, 30, 60].map((sec) => (
                  <button
                    key={sec}
                    onClick={() => setTimerPreset(sec)}
                    className={`px-2 py-0.5 rounded-lg font-bold text-[11px] transition-colors ${
                      timerPreset === sec
                        ? 'bg-brand-primary text-white'
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
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Open Answers ({timerPreset}s)</span>
                </button>
              ) : (
                <button
                  onClick={onCloseAnswers}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Close Answers</span>
                </button>
              )}

              <button
                onClick={onRevealResults}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 transition-all"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Show Results</span>
              </button>

              <button
                onClick={onShowLeaderboard}
                className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all"
              >
                <Trophy className="w-3.5 h-3.5" />
                <span>Leaderboard</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Admin View */}
      <main className="max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        
        {/* Left Column: Question & Responses */}
        <div className="lg:col-span-8 space-y-6">
          
          {currentQIndex === 0 ? (
            <div className="bg-white dark:bg-brand-darkCard border border-slate-200 dark:border-brand-darkBorder rounded-2xl p-10 text-center space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 mx-auto flex items-center justify-center border border-slate-200 dark:border-slate-700">
                <HelpCircle className="w-8 h-8" />
              </div>
              <div className="space-y-1.5">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  Quiz Ready to Start
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Click <strong>Start Quiz Session</strong> when all participants have entered the room.
                </p>
              </div>
              <button
                onClick={onStartQuiz}
                className="px-6 py-3 bg-brand-primary hover:bg-brand-primaryDark text-white font-bold text-xs rounded-xl transition-all"
              >
                Start Quiz Session
              </button>
            </div>
          ) : (
            <div className="bg-white dark:bg-brand-darkCard border border-slate-200 dark:border-brand-darkBorder rounded-2xl p-6 sm:p-7 space-y-5">
              
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs uppercase tracking-wider border border-slate-200 dark:border-slate-700">
                  Question {currentQIndex} of {totalQuestions}
                </span>

                <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border flex items-center gap-1.5 ${
                  state.answersOpen
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                    : state.resultsRevealed
                    ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                }`}>
                  {state.answersOpen ? (
                    <>
                      <Unlock className="w-3.5 h-3.5" />
                      <span>Answers Open</span>
                    </>
                  ) : state.resultsRevealed ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Results Revealed</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Answers Closed</span>
                    </>
                  )}
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug">
                {currentQ?.question}
              </h2>

              {/* Options & Distribution */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {currentQ?.options.map((option, idx) => {
                  const count = distribution[idx] || 0;
                  const pct = totalAnswered > 0 ? Math.round((count / totalAnswered) * 100) : 0;
                  const isCorrect = state.resultsRevealed && idx === currentQ.correctOption;

                  const labels = ['A', 'B', 'C', 'D'];

                  return (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-xl border transition-all relative overflow-hidden ${
                        isCorrect
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500'
                          : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      {/* Bar indicator */}
                      <div
                        className="absolute top-0 bottom-0 left-0 bg-slate-200/50 dark:bg-slate-800/60 transition-all duration-300 pointer-events-none"
                        style={{ width: `${pct}%` }}
                      />

                      <div className="relative z-10 flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2.5">
                          <span className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs shrink-0 ${
                            isCorrect ? 'bg-emerald-600 text-white' : 'bg-brand-primary text-white'
                          }`}>
                            {labels[idx]}
                          </span>
                          <span className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-100 pt-0.5">
                            {option}
                          </span>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="font-mono font-bold text-xs text-slate-900 dark:text-white block">
                            {count}
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400">
                            {pct}%
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {state.resultsRevealed && currentQ?.explanation && (
                <div className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
                  <strong className="text-slate-900 dark:text-white">Explanation:</strong> {currentQ.explanation}
                </div>
              )}
            </div>
          )}

          {/* Leaderboard Overlay when visible */}
          {state.leaderboardVisible && state.leaderboard && (
            <div className="bg-white dark:bg-brand-darkCard border border-purple-200 dark:border-purple-900/50 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Live Leaderboard
                </h3>
              </div>

              <div className="space-y-2">
                {state.leaderboard.map((item) => (
                  <div
                    key={item.nickname}
                    className="flex items-center justify-between p-3 rounded-xl border bg-slate-50 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-md bg-purple-600 text-white font-bold text-[10px] flex items-center justify-center">
                        #{item.rank}
                      </span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{item.nickname}</span>
                    </div>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
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
          <div className="bg-white dark:bg-brand-darkCard border border-slate-200 dark:border-brand-darkBorder rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-brand-secondary" />
                <span>Responses</span>
              </h3>
              <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                {totalAnswered} / {state.participantCount}
              </span>
            </div>

            <div className="space-y-2">
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-brand-secondary h-full transition-all duration-300 rounded-full"
                  style={{
                    width: state.participantCount > 0 ? `${(totalAnswered / state.participantCount) * 100}%` : '0%',
                  }}
                />
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center">
                Real-time answer progress
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
