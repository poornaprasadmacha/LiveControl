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
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col justify-between font-sans">
      
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5 sticky top-0 z-30 flex flex-wrap items-center justify-between gap-4">
        
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-extrabold text-sm tracking-wider">
            QZ
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900">
                Quiz Host Studio
              </span>
              <span className="font-mono text-xs sm:text-sm px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-800 font-bold border border-slate-300">
                {state.id}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 font-semibold truncate max-w-xs sm:max-w-md">
              {state.title}
            </p>
          </div>
        </div>

        {/* Status Indicators & Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
            <span>LIVE QUIZ</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs sm:text-sm font-bold border border-slate-200">
            <Users className="w-4 h-4 text-emerald-700" />
            <span>{state.participantCount} Participants</span>
          </div>

          <button
            onClick={() => setIsShareOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold flex items-center gap-2 border border-slate-300 transition-all"
          >
            <Share2 className="w-4 h-4 text-emerald-800" />
            <span>Share Room</span>
          </button>

          <button
            onClick={onDownloadResults}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold flex items-center gap-2 border border-slate-300 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download CSV</span>
          </button>

          <button
            onClick={() => setIsEndModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            <span>End Quiz</span>
          </button>
        </div>
      </header>

      {/* Control Action Toolbar */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex flex-wrap items-center gap-2.5">
            {currentQIndex === 0 ? (
              <button
                onClick={onStartQuiz}
                className="px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-extrabold text-sm flex items-center gap-2 transition-all"
              >
                <Play className="w-4 h-4" />
                <span>Start Quiz Session</span>
              </button>
            ) : (
              <>
                <button
                  onClick={handlePrevQ}
                  disabled={currentQIndex <= 1}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-sm font-bold flex items-center gap-1.5 border border-slate-300"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Prev</span>
                </button>

                <span className="font-mono font-extrabold text-sm text-slate-900 px-3 py-1 bg-slate-100 rounded-lg border border-slate-300">
                  Question {currentQIndex} / {totalQuestions}
                </span>

                <button
                  onClick={handleNextQ}
                  disabled={currentQIndex >= totalQuestions}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-sm font-bold flex items-center gap-1.5 border border-slate-300"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          {/* Answer Controls & Timers */}
          {currentQIndex > 0 && (
            <div className="flex flex-wrap items-center gap-2.5">
              
              <div className="flex items-center bg-slate-100 border border-slate-300 rounded-xl p-1 text-sm">
                <Timer className="w-4 h-4 text-slate-600 ml-2 mr-1.5" />
                {[15, 30, 60].map((sec) => (
                  <button
                    key={sec}
                    onClick={() => setTimerPreset(sec)}
                    className={`px-3 py-1 rounded-lg font-bold text-xs transition-colors ${
                      timerPreset === sec
                        ? 'bg-blue-900 text-white'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {sec}s
                  </button>
                ))}
              </div>

              {!state.answersOpen ? (
                <button
                  onClick={() => onOpenAnswers(timerPreset)}
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm flex items-center gap-2 transition-all"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Open Answers ({timerPreset}s)</span>
                </button>
              ) : (
                <button
                  onClick={onCloseAnswers}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-sm flex items-center gap-2 transition-all"
                >
                  <Lock className="w-4 h-4" />
                  <span>Close Answers</span>
                </button>
              )}

              <button
                onClick={onRevealResults}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-extrabold text-sm flex items-center gap-2 border border-slate-300 transition-all"
              >
                <Eye className="w-4 h-4" />
                <span>Show Results</span>
              </button>

              <button
                onClick={onShowLeaderboard}
                className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-sm flex items-center gap-2 transition-all"
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
        
        {/* Left Column: Question & Responses with Extra Size */}
        <div className="lg:col-span-8 space-y-6">
          
          {currentQIndex === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-800 mx-auto flex items-center justify-center border border-slate-200">
                <HelpCircle className="w-8 h-8 text-emerald-800" />
              </div>
              <div className="space-y-1.5">
                <h2 className="text-2xl font-extrabold text-slate-900">
                  Quiz Ready to Start
                </h2>
                <p className="text-sm text-slate-600 max-w-sm mx-auto font-medium">
                  Click <strong>Start Quiz Session</strong> when all participants have entered the room.
                </p>
              </div>
              <button
                onClick={onStartQuiz}
                className="px-6 py-3 bg-blue-900 hover:bg-blue-800 text-white font-extrabold text-sm rounded-xl transition-all"
              >
                Start Quiz Session
              </button>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
              
              <div className="flex items-center justify-between">
                <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 font-extrabold text-xs sm:text-sm uppercase tracking-wider border border-slate-300">
                  Question {currentQIndex} of {totalQuestions}
                </span>

                <span className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-extrabold border flex items-center gap-2 ${
                  state.answersOpen
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : state.resultsRevealed
                    ? 'bg-purple-50 text-purple-800 border-purple-300'
                    : 'bg-slate-100 text-slate-700 border-slate-300'
                }`}>
                  {state.answersOpen ? (
                    <>
                      <Unlock className="w-4 h-4" />
                      <span>Answers Open</span>
                    </>
                  ) : state.resultsRevealed ? (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Results Revealed</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Answers Closed</span>
                    </>
                  )}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
                {currentQ?.question}
              </h2>

              {/* Options & Distribution with Extra Size */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {currentQ?.options.map((option, idx) => {
                  const count = distribution[idx] || 0;
                  const pct = totalAnswered > 0 ? Math.round((count / totalAnswered) * 100) : 0;
                  const isCorrect = state.resultsRevealed && idx === currentQ.correctOption;

                  const labels = ['A', 'B', 'C', 'D'];

                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border transition-all relative overflow-hidden ${
                        isCorrect
                          ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div
                        className="absolute top-0 bottom-0 left-0 bg-blue-100/60 transition-all duration-300 pointer-events-none"
                        style={{ width: `${pct}%` }}
                      />

                      <div className="relative z-10 flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-extrabold text-xs shrink-0 ${
                            isCorrect ? 'bg-emerald-700 text-white' : 'bg-blue-900 text-white'
                          }`}>
                            {labels[idx]}
                          </span>
                          <span className="text-sm sm:text-base font-semibold text-slate-900 pt-0.5 leading-snug">
                            {option}
                          </span>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="font-mono font-extrabold text-sm sm:text-base text-slate-900 block">
                            {count}
                          </span>
                          <span className="text-xs font-bold text-slate-500">
                            {pct}%
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {state.resultsRevealed && currentQ?.explanation && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-800 space-y-1">
                  <strong className="text-slate-900 font-extrabold block">Explanation:</strong>
                  <p className="leading-relaxed">{currentQ.explanation}</p>
                </div>
              )}
            </div>
          )}

          {/* Leaderboard Overlay */}
          {state.leaderboardVisible && state.leaderboard && (
            <div className="bg-white border border-purple-200 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2.5">
                <Trophy className="w-6 h-6 text-purple-700" />
                <h3 className="text-xl font-extrabold text-slate-900">
                  Live Leaderboard
                </h3>
              </div>

              <div className="space-y-2.5">
                {state.leaderboard.map((item) => (
                  <div
                    key={item.nickname}
                    className="flex items-center justify-between p-3.5 rounded-xl border bg-slate-50 border-slate-200 text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-purple-700 text-white font-extrabold text-xs flex items-center justify-center">
                        #{item.rank}
                      </span>
                      <span className="font-extrabold text-slate-900">{item.nickname}</span>
                    </div>
                    <span className="font-mono font-extrabold text-base text-blue-900">
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
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-700" />
                <span>Responses</span>
              </h3>
              <span className="font-mono text-sm font-extrabold text-blue-900">
                {totalAnswered} / {state.participantCount}
              </span>
            </div>

            <div className="space-y-2.5">
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-700 h-full transition-all duration-300 rounded-full"
                  style={{
                    width: state.participantCount > 0 ? `${(totalAnswered / state.participantCount) * 100}%` : '0%',
                  }}
                />
              </div>

              <p className="text-xs text-slate-500 text-center font-medium">
                Live response progress updating in real time
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
