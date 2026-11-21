'use client';

import React from 'react';

interface VoiceControlProps {
  roomId?: string;
  role?: 'ADMIN' | 'VIEWER' | 'PARTICIPANT';
  token?: string;
  participantId?: string;
  nickname?: string;
}

// Mic and Speaker system removed per requirement
export const VoiceControl: React.FC<VoiceControlProps> = () => {
  return null;
};
