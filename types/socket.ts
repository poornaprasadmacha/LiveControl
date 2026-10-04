import { PublicRoomState, QuizResultRow } from './index';

export interface ServerToClientEvents {
  roomState: (state: PublicRoomState) => void;
  slideChanged: (data: { currentSlide: number; isBlank: boolean }) => void;
  adminStatusChanged: (data: { connected: boolean }) => void;
  viewerCountUpdated: (data: { count: number }) => void;
  participantCountUpdated: (data: { count: number }) => void;
  quizStateUpdated: (data: Partial<PublicRoomState>) => void;
  liveAnswerUpdate: (data: { answeredCount: number; totalCount: number; distribution: Record<number, number> }) => void;
  resultsRevealed: (data: { correctOption: number; distribution: Record<number, number>; explanation?: string }) => void;
  leaderboardUpdated: (data: { leaderboard: Array<{ nickname: string; score: number; rank: number }> }) => void;
  sessionEnded: (data: { reason: string }) => void;
  error: (data: { message: string; code?: string }) => void;
  authenticated: (data: { success: boolean; token?: string }) => void;

  // Real-Time WebRTC Voice Signaling Events
  webrtcOffer: (data: { senderSocketId: string; sdp: any; senderRole: string; nickname?: string }) => void;
  webrtcAnswer: (data: { senderSocketId: string; sdp: any }) => void;
  webrtcIceCandidate: (data: { senderSocketId: string; candidate: any }) => void;
  speakRequested: (data: { participantId: string; socketId: string; nickname: string }) => void;
  speakPermissionGranted: (data: { allowed: boolean }) => void;
  audioStatusChanged: (data: { socketId: string; isMuted: boolean; role: string; nickname?: string }) => void;
  userStartedVoice: (data: { socketId: string; role: string; nickname?: string }) => void;
  userStoppedVoice: (data: { socketId: string }) => void;
}

export interface ClientToServerEvents {
  createRoom: (
    data: { type: 'presentation' | 'quiz'; title: string; pin: string },
    callback: (res: { success: boolean; roomId?: string; adminToken?: string; error?: string }) => void
  ) => void;

  adminAuthenticate: (
    data: { roomId: string; pin: string },
    callback: (res: { success: boolean; token?: string; error?: string }) => void
  ) => void;

  joinRoom: (
    data: { roomId: string; role: 'ADMIN' | 'VIEWER' | 'PARTICIPANT'; token?: string; nickname?: string; participantId?: string },
    callback: (res: { success: boolean; state?: PublicRoomState; participantId?: string; error?: string }) => void
  ) => void;

  changeSlide: (data: { roomId: string; slideIndex: number; isBlank?: boolean; token: string }) => void;
  
  toggleBlank: (data: { roomId: string; token: string }) => void;

  startQuiz: (data: { roomId: string; token: string }) => void;

  changeQuestion: (data: { roomId: string; questionIndex: number; token: string }) => void;

  openAnswers: (data: { roomId: string; durationSeconds?: number; token: string }) => void;

  closeAnswers: (data: { roomId: string; token: string }) => void;

  submitAnswer: (
    data: { roomId: string; participantId: string; questionIndex: number; optionIndex: number },
    callback?: (res: { success: boolean; error?: string }) => void
  ) => void;

  revealResults: (data: { roomId: string; token: string }) => void;

  showLeaderboard: (data: { roomId: string; token: string }) => void;

  endSession: (
    data: { roomId: string; token: string },
    callback?: (res: { success: boolean; error?: string }) => void
  ) => void;

  // Real-Time WebRTC Voice Signaling Handlers
  sendWebrtcOffer: (data: { targetSocketId: string; sdp: any; senderRole: string; nickname?: string }) => void;
  sendWebrtcAnswer: (data: { targetSocketId: string; sdp: any }) => void;
  sendWebrtcIceCandidate: (data: { targetSocketId: string; candidate: any }) => void;
  requestToSpeak: (data: { roomId: string; participantId: string; nickname: string }) => void;
  grantSpeakPermission: (data: { roomId: string; targetSocketId: string; allowed: boolean; token: string }) => void;
  toggleAudioMute: (data: { roomId: string; isMuted: boolean }) => void;
  startVoiceBroadcast: (data: { roomId: string; role: string; nickname?: string }) => void;
  stopVoiceBroadcast: (data: { roomId: string }) => void;
}
