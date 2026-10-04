'use client';

import React from 'react';
import { AlertTriangle, Download, Trash2, X } from 'lucide-react';

interface EndSessionModalProps {
  isOpen: boolean;
  isQuiz: boolean;
  onClose: () => void;
  onConfirmEnd: () => void;
  onDownloadResults?: () => void;
}

export const EndSessionModal: React.FC<EndSessionModalProps> = ({
  isOpen,
  isQuiz,
  onClose,
  onConfirmEnd,
  onDownloadResults,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-brand-darkCard border border-rose-200 dark:border-rose-900/40 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
        
        {/* Top warning stripe */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-rose-500 via-amber-500 to-rose-600" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-brand-darkBg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 border border-rose-200 dark:border-rose-800">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              End & Delete Session?
            </h2>
            <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
              Permanent Server Memory Erasure
            </p>
          </div>
        </div>

        <div className="p-4 bg-rose-50/70 dark:bg-rose-950/30 rounded-2xl border border-rose-100 dark:border-rose-900/50 space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
          <p className="font-semibold text-slate-900 dark:text-slate-100">
            This will disconnect all viewers/participants and permanently delete active session data from server memory:
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400 text-xs">
            <li>Current presentation slide & viewer status</li>
            <li>Participant nicknames & live connection sockets</li>
            <li>Quiz answers, timers, and active scores</li>
          </ul>
          <p className="font-bold text-rose-600 dark:text-rose-400 pt-1">
            This action cannot be undone.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 dark:border-brand-darkBorder text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-brand-darkBg transition-colors"
          >
            Cancel
          </button>

          {isQuiz && onDownloadResults && (
            <button
              onClick={onDownloadResults}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-brand-secondary text-white font-semibold text-xs flex items-center justify-center gap-2 hover:bg-brand-secondaryDark shadow-md transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download Results</span>
            </button>
          )}

          <button
            onClick={onConfirmEnd}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-600/20 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            <span>End & Delete Session</span>
          </button>
        </div>
      </div>
    </div>
  );
};
