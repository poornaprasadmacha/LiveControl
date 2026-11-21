'use client';

import React, { useState } from 'react';
import { Share2, Copy, Check, X } from 'lucide-react';

interface ShareModalProps {
  roomId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ roomId, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const viewerUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/room/${roomId}`
    : `https://livecontrol.app/room/${roomId}`;

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `Join LiveControl Session (${roomId})`,
          text: `Join the live presentation/quiz session: ${roomId}`,
          url: viewerUrl,
        });
        return;
      } catch (err) {
        // Fallback to copy if cancelled
      }
    }
    handleCopy();
  };

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(viewerUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-brand-darkCard border border-slate-200 dark:border-brand-darkBorder rounded-2xl max-w-md w-full p-6 space-y-5 relative">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1.5 text-center">
          <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 text-brand-secondary mx-auto flex items-center justify-center border border-slate-200 dark:border-slate-700">
            <Share2 className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Share Session Link
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Invite audience members to room <strong className="text-slate-800 dark:text-slate-200 font-mono">{roomId}</strong>
          </p>
        </div>

        {/* Room Code Display */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-0.5">
            Room Join Code
          </span>
          <span className="text-2xl font-black font-mono tracking-wider text-slate-900 dark:text-white">
            {roomId}
          </span>
        </div>

        {/* URL Input + Copy */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            Direct Link for Viewers:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={viewerUrl}
              className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-700 dark:text-slate-300 focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 bg-brand-primary hover:bg-brand-primaryDark text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Web Share Button */}
        <div className="pt-1 flex flex-col gap-2">
          <button
            onClick={handleShare}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 transition-all"
          >
            <Share2 className="w-4 h-4 text-brand-secondary" />
            <span>Share via System Options</span>
          </button>
        </div>
      </div>
    </div>
  );
};
