'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/shared/Navbar';
import { VoiceControl } from '@/components/shared/VoiceControl';
import { VoiceDiagnosticsModal, PeerDiagnostics } from '@/components/shared/VoiceDiagnosticsModal';
import { socket } from '@/lib/socket';
import { Mic, MicOff, Volume2, Activity, Wifi, Radio, Sparkles, ShieldCheck } from 'lucide-react';

export default function VoiceTestPage() {
  const [roomId, setRoomId] = useState('TEST-VOICE-ROOM');
  const [nickname, setNickname] = useState('Tester-1');
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [micState, setMicState] = useState<'active' | 'muted' | 'denied' | 'connecting'>('muted');

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    if (socket.connected) {
      handleConnect();
    }

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
    };
  }, []);

  return (
    <div className="min-h-screen bg-brand-bgLight dark:bg-brand-darkBg text-slate-900 dark:text-white flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-10 space-y-8">
        
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-200">
            <Activity className="w-4 h-4 animate-pulse" />
            <span>WebRTC 2-Way Voice Test Bench</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            LiveControl Voice Diagnostics
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Open this page in two separate browser tabs or on two devices to test real-time two-way voice communication over WebRTC mesh.
          </p>
        </div>

        {/* Test Control Box */}
        <div className="bg-white dark:bg-brand-darkCard border border-sky-100 dark:border-brand-darkBorder rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                Test Room Code
              </label>
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-brand-darkBorder bg-slate-50 dark:bg-brand-darkBg font-mono font-bold text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                Tester Nickname
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-brand-darkBorder bg-slate-50 dark:bg-brand-darkBg font-bold text-sm"
              />
            </div>
          </div>

          {/* Embedded Voice Control Widget */}
          <div className="p-4 bg-slate-50 dark:bg-brand-darkBg rounded-2xl border border-sky-100 dark:border-brand-darkBorder flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 block">
                Live Voice Channel ({roomId})
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                Connected as: <strong className="text-brand-primary dark:text-brand-light">{nickname}</strong>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <VoiceControl
                roomId={roomId}
                role="PARTICIPANT"
                nickname={nickname}
              />

              <button
                onClick={() => setIsDiagnosticsOpen(true)}
                className="px-3.5 py-2 bg-sky-100 dark:bg-brand-darkCard hover:bg-sky-200 text-brand-primary dark:text-brand-light rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <Activity className="w-4 h-4" />
                <span>Open Stats</span>
              </button>
            </div>
          </div>

          <div className="p-4 bg-sky-50 dark:bg-brand-darkBg rounded-2xl border border-sky-100 dark:border-brand-darkBorder text-xs space-y-2">
            <h4 className="font-bold text-brand-primary dark:text-brand-light flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-secondary" />
              <span>How to perform 2-Device / 2-Tab Acceptance Test:</span>
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-slate-600 dark:text-slate-400">
              <li>Open <strong>Tab 1</strong> (e.g. `Tester-1`) and click <strong>"🎙️ Mic On"</strong>.</li>
              <li>Open <strong>Tab 2</strong> on another tab or phone with the same Room Code (`TEST-VOICE-ROOM`).</li>
              <li>Speak into Tab 1 microphone → Tab 2 should play clear real-time voice audio.</li>
              <li>Click <strong>"🎙️ Mic On"</strong> on Tab 2 → Tab 1 should hear Tab 2's voice!</li>
              <li>Click <strong>"Open Stats"</strong> to verify ICE connection state and real-time audio packet counters (`bytesSent` & `bytesReceived`).</li>
            </ol>
          </div>
        </div>
      </main>

      {/* Diagnostics Modal */}
      <VoiceDiagnosticsModal
        isOpen={isDiagnosticsOpen}
        onClose={() => setIsDiagnosticsOpen(false)}
        micState={micState}
        localTrackState={{ readyState: 'live', enabled: true }}
        peersDiagnostics={[]}
        socketConnected={isConnected}
        onRefresh={() => {}}
      />
    </div>
  );
}
