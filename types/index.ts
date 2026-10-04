export type RoomType = 'presentation' | 'quiz';

export interface BaseRoom {
  id: string;
  type: RoomType;
  title: string;
  adminPin: string; // Clean pin for room auth check
  adminToken: string; // Admin secret token for session auth
  adminConnected: boolean;
  createdAt: number;
  lastAdminSeenAt: number;
}

export interface Viewer {
  socketId: string;
  joinedAt: number;
}

export interface PresentationRoom extends BaseRoom {
  type: 'presentation';
  currentSlide: number;
  totalSlides: number;
  isBlank: boolean;
  viewers: Record<string, Viewer>;
}

export interface Participant {
  participantId: string;
  socketId: string;
  nickname: string;
  joinedAt: number;
  score: number;
  correctAnswersCount: number;
  wrongAnswersCount: number;
  questionsAnsweredCount: number;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctOption: number; // 0-indexed
  explanation?: string;
  points?: number;
}

export interface QuizRoom extends BaseRoom {
  type: 'quiz';
  currentQuestion: number; // 1-indexed (0 means quiz not started)
  totalQuestions: number;
  answersOpen: boolean;
  resultsRevealed: boolean;
  leaderboardVisible: boolean;
  endsAt: number | null;
  participants: Record<string, Participant>; // participantId -> Participant
  socketToParticipantMap: Record<string, string>; // socketId -> participantId
  answers: Record<number, Record<string, number>>; // questionIndex (1-indexed) -> { participantId: optionIndex }
  questions: QuizQuestion[];
}

export type Room = PresentationRoom | QuizRoom;

export interface QuizResultRow {
  nickname: string;
  score: number;
  correctAnswers: number;
  wrongAnswers: number;
  questionsAnswered: number;
}

export interface PublicPresentationState {
  id: string;
  type: 'presentation';
  title: string;
  currentSlide: number;
  totalSlides: number;
  isBlank: boolean;
  adminConnected: boolean;
  viewerCount: number;
}

export interface PublicQuizState {
  id: string;
  type: 'quiz';
  title: string;
  currentQuestion: number;
  totalQuestions: number;
  answersOpen: boolean;
  resultsRevealed: boolean;
  leaderboardVisible: boolean;
  endsAt: number | null;
  adminConnected: boolean;
  participantCount: number;
  currentQuestionData: {
    id: number;
    question: string;
    options: string[];
  } | null;
  userAnswer?: number;
  userScore?: number;
  correctOption?: number;
  answerStats?: Record<number, number>; // optionIndex -> count (only when resultsRevealed)
  leaderboard?: { nickname: string; score: number; rank: number }[];
}

export type PublicRoomState = PublicPresentationState | PublicQuizState;
