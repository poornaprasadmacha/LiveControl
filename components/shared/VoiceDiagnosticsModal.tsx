'use client';

import React, { useState, useEffect } from 'react';
import { X, RefreshCw, Activity, ShieldCheck, Wifi, Radio, Volume2 } from 'lucide-react';

export interface PeerDiagnostics {
  socketId: string;
  nickname?: string;
  iceConnectionState: string;
  connectionState: string;
  iceGatheringState: string;
  bytesSent: number;
  packetsSent: number;
  bytesReceived: number;
  packetsReceived: number;
  packetsLost: number;
  jitter: number;
  audioCodec: string;
}

interface VoiceDiagnosticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  micState: 'active' | 'muted' | 'denied' | 'connecting';
  localTrackState: { readyState: string; enabled: boolean } | null;
  peersDiagnostics: PeerDiagnostics[];
  socketConnected: boolean;
  onRefresh: () => void;
}

export const VoiceDiagnosticsModal: React.FC<VoiceDiagnosticsModalProps> = ({
  isOpen,
  onClose,
  micState,
  localTrackState,
  peersDiagnostics,
  socketConnected,
  onRefresh,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-brand-darkCard border border-sky-100 dark:border-brand-darkBorder rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-brand-darkBg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-between border-b border-sky-100 dark:border-brand-darkBorder pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-primary text-white flex items-center justify-center font-bold">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                Voice WebRTC Diagnostics
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Real-time connection, ICE state, and RTP packet metrics
              </p>
            </div>
          </div>

          <button
            onClick={onRefresh}
            className="px-3 py-1.5 bg-sky-100 dark:bg-brand-darkBg hover:bg-sky-200 text-brand-primary dark:text-brand-light rounded-xl font-extrabold text-xs flex items-center gap-1.5 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Stats</span>
          </button>
        </div>

        {/* Global Hardware & Connection Status */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          
          <div className="p-3 bg-slate-50 dark:bg-brand-darkBg rounded-2xl border border-slate-200 dark:border-brand-darkBorder space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Socket Signal</span>
            <div className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full ${socketConnected ? 'bg-emerald-500' : 'bg-rose-500'}`} />
              <span className="text-xs font-bold">{socketConnected ? 'Connected' : 'Offline'}</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-brand-darkBg rounded-2xl border border-slate-200 dark:border-brand-darkBorder space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Microphone</span>
            <div className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full ${
                micState === 'active' ? 'bg-emerald-500 animate-pulse' : micState === 'denied' ? 'bg-rose-500' : 'bg-amber-500'
              }`} />
              <span className="text-xs font-bold capitalize">{micState}</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-brand-darkBg rounded-2xl border border-slate-200 dark:border-brand-darkBorder space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Audio Track</span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-mono font-bold text-brand-primary dark:text-brand-light">
                {localTrackState ? `${localTrackState.readyState} (${localTrackState.enabled ? 'Enabled' : 'Muted'})` : 'None'}
              </span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-brand-darkBg rounded-2xl border border-slate-200 dark:border-brand-darkBorder space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Active Peers</span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-300">
                {peersDiagnostics.length} Peer Connections
              </span>
            </div>
          </div>
        </div>

        {/* Peer Connections Detail Table */}
        <div className="space-y-3">
          <h3 className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider">
            WebRTC Peer Connections ({peersDiagnostics.length})
          </h3>

          {peersDiagnostics.length === 0 ? (
            <div className="p-6 text-center bg-slate-50 dark:bg-brand-darkBg rounded-2xl border border-dashed border-slate-200 dark:border-brand-darkBorder text-xs text-slate-400">
              No active peer connections. Toggle microphone or wait for other room members to connect.
            </div>
          ) : (
            <div className="space-y-3">
              {peersDiagnostics.map((peer) => (
                <div
                  key={peer.socketId}
                  className="p-4 bg-slate-50 dark:bg-brand-darkBg rounded-2xl border border-sky-100 dark:border-brand-darkBorder space-y-3 text-xs"
                >
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-brand-darkBorder pb-2">
                    <div className="flex items-center gap-2">
                      <Wifi className="w-4 h-4 text-brand-secondary" />
                      <span className="font-extrabold text-slate-900 dark:text-white">
                        {peer.nickname || `Peer ${peer.socketId.substring(0, 6)}`}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span className={`px-2 py-0.5 rounded ${
                        peer.iceConnectionState === 'connected' || peer.iceConnectionState === 'completed'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold'
                          : peer.iceConnectionState === 'failed'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-bold'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold'
                      }`}>
                        ICE: {peer.iceConnectionState}
                      </span>

                      <span className="px-2 py-0.5 rounded bg-sky-100 dark:bg-brand-darkCard text-brand-primary dark:text-brand-light font-bold">
                        State: {peer.connectionState}
                      </span>
                    </div>
                  </div>

                  {/* Packet Counters */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
                    <div className="p-2 bg-white dark:bg-brand-darkCard rounded-xl border border-slate-100 dark:border-brand-darkBorder">
                      <span className="text-slate-400 block text-[9px]">Outbound Bytes</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {(peer.bytesSent / 1024).toFixed(1)} KB
                      </span>
                    </div>

                    <div className="p-2 bg-white dark:bg-brand-darkCard rounded-xl border border-slate-100 dark:border-brand-darkBorder">
                      <span className="text-slate-400 block text-[9px]">Inbound Bytes</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {(peer.bytesReceived / 1024).toFixed(1)} KB
                      </span>
                    </div>

                    <div className="p-2 bg-white dark:bg-brand-darkCard rounded-xl border border-slate-100 dark:border-brand-darkBorder">
                      <span className="text-slate-400 block text-[9px]">Packets Rx / Lost</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {peer.packetsReceived} / {peer.packetsLost}
                      </span>
                    </div>

                    <div className="p-2 bg-white dark:bg-brand-darkCard rounded-xl border border-slate-100 dark:border-brand-darkBorder">
                      <span className="text-slate-400 block text-[9px]">Codec & Jitter</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {peer.audioCodec || 'Opus'} ({(peer.jitter * 1000).toFixed(1)}ms)
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
