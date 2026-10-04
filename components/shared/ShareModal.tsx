'use client';

import React, { useState } from 'react';
import { Share2, Copy, Check, X, QrCode } from 'lucide-react';

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
        // Fallback to copy if user cancels or share fails
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-brand-darkCard border border-sky-100 dark:border-brand-darkBorder rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-6 relative">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-brand-darkBg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-2 text-center">
          <div className="w-12 h-12 rounded-2xl bg-brand-light/50 dark:bg-brand-secondary/20 text-brand-primary dark:text-brand-light mx-auto flex items-center justify-center">
            <Share2 className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Share Session Link
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Invite audience members to join room <strong className="text-brand-primary dark:text-brand-light font-mono">{roomId}</strong>
          </p>
        </div>

        {/* Room Code Display */}
        <div className="p-4 bg-sky-50 dark:bg-brand-darkBg rounded-xl border border-sky-100 dark:border-brand-darkBorder text-center">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest block mb-1">
            Room Join Code
          </span>
          <span className="text-3xl font-black font-mono tracking-wider text-brand-primary dark:text-brand-light">
            {roomId}
          </span>
        </div>

        {/* URL Input + Copy */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
            Direct Link for Viewers / Participants:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={viewerUrl}
              className="flex-1 bg-slate-50 dark:bg-brand-darkBg border border-slate-200 dark:border-brand-darkBorder rounded-xl px-3 py-2 text-xs font-mono text-slate-700 dark:text-slate-300 focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-brand-primary text-white text-xs font-bold rounded-xl flex items-center gap-1.5 hover:bg-brand-primaryDark shadow-sm transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Copied!</span>
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
        <div className="pt-2 flex flex-col gap-2">
          <button
            onClick={handleShare}
            className="w-full py-2.5 bg-brand-secondary text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-brand-secondaryDark shadow-md transition-all"
          >
            <Share2 className="w-4 h-4" />
            <span>Share via System Options</span>
          </button>
        </div>
      </div>
    </div>
  );
};
