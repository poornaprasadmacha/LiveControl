import { PresentationRoom, QuizRoom, Room, Viewer, Participant } from '../../types';
import { SAMPLE_SLIDES, SAMPLE_PRESENTATION_TITLE } from '../../lib/samplePresentation';
import { SAMPLE_QUIZ_QUESTIONS, SAMPLE_QUIZ_TITLE } from '../../lib/sampleQuiz';

export interface IRoomStore {
  createRoom(type: 'presentation' | 'quiz', title: string, adminPin: string): Room;
  getRoom(id: string): Room | undefined;
  deleteRoom(id: string): boolean;
  updateAdminStatus(id: string, connected: boolean): void;
  
  // Presentation methods
  addViewer(id: string, socketId: string): number;
  removeViewer(id: string, socketId: string): number;
  setSlide(id: string, slideIndex: number, isBlank?: boolean): PresentationRoom | null;
  toggleBlank(id: string): PresentationRoom | null;

  // Quiz methods
  addParticipant(id: string, socketId: string, nickname: string, participantId: string): { participant: Participant; count: number } | null;
  removeParticipant(id: string, socketId: string): number;
  setQuizState(id: string, updates: Partial<QuizRoom>): QuizRoom | null;
  submitAnswer(id: string, participantId: string, questionIndex: number, optionIndex: number): boolean;
  calculateScoresAndStats(id: string, questionIndex: number): {
    correctOption: number;
    distribution: Record<number, number>;
    leaderboard: Array<{ nickname: string; score: number; rank: number }>;
  } | null;
  getQuizResultsCSV(id: string): string | null;

  // Cleanup
  cleanExpiredRooms(expirationMinutes: number): string[];
}

export class MemoryRoomStore implements IRoomStore {
  private rooms: Map<string, Room> = new Map();

  private generateRoomId(): string {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const fullId = `LC-${code}`;
    if (this.rooms.has(fullId)) {
      return this.generateRoomId();
    }
    return fullId;
  }

  createRoom(type: 'presentation' | 'quiz', title: string, adminPin: string): Room {
    const roomId = this.generateRoomId();
    const adminToken = `tok_${Math.random().toString(36).substring(2)}_${Date.now()}`;
    const now = Date.now();

    if (type === 'presentation') {
      const room: PresentationRoom = {
        id: roomId,
        type: 'presentation',
        title: title || SAMPLE_PRESENTATION_TITLE,
        adminPin,
        adminToken,
        adminConnected: true,
        currentSlide: 1,
        totalSlides: SAMPLE_SLIDES.length,
        isBlank: false,
        viewers: {},
        createdAt: now,
        lastAdminSeenAt: now,
      };
      this.rooms.set(roomId, room);
      return room;
    } else {
      const room: QuizRoom = {
        id: roomId,
        type: 'quiz',
        title: title || SAMPLE_QUIZ_TITLE,
        adminPin,
        adminToken,
        adminConnected: true,
        currentQuestion: 0,
        totalQuestions: SAMPLE_QUIZ_QUESTIONS.length,
        answersOpen: false,
        resultsRevealed: false,
        leaderboardVisible: false,
        endsAt: null,
        participants: {},
        socketToParticipantMap: {},
        answers: {},
        questions: SAMPLE_QUIZ_QUESTIONS,
        createdAt: now,
        lastAdminSeenAt: now,
      };
      this.rooms.set(roomId, room);
      return room;
    }
  }

  getRoom(id: string): Room | undefined {
    return this.rooms.get(id.toUpperCase());
  }

  deleteRoom(id: string): boolean {
    return this.rooms.delete(id.toUpperCase());
  }

  updateAdminStatus(id: string, connected: boolean): void {
    const room = this.getRoom(id);
    if (room) {
      room.adminConnected = connected;
      if (connected) {
        room.lastAdminSeenAt = Date.now();
      }
    }
  }

  // Presentation Methods
  addViewer(id: string, socketId: string): number {
    const room = this.getRoom(id);
    if (room && room.type === 'presentation') {
      room.viewers[socketId] = {
        socketId,
        joinedAt: Date.now(),
      };
      return Object.keys(room.viewers).length;
    }
    return 0;
  }

  removeViewer(id: string, socketId: string): number {
    const room = this.getRoom(id);
    if (room && room.type === 'presentation') {
      delete room.viewers[socketId];
      return Object.keys(room.viewers).length;
    }
    return 0;
  }

  setSlide(id: string, slideIndex: number, isBlank?: boolean): PresentationRoom | null {
    const room = this.getRoom(id);
    if (room && room.type === 'presentation') {
      if (slideIndex >= 1 && slideIndex <= room.totalSlides) {
        room.currentSlide = slideIndex;
      }
      if (typeof isBlank === 'boolean') {
        room.isBlank = isBlank;
      }
      return room;
    }
    return null;
  }

  toggleBlank(id: string): PresentationRoom | null {
    const room = this.getRoom(id);
    if (room && room.type === 'presentation') {
      room.isBlank = !room.isBlank;
      return room;
    }
    return null;
  }

  // Quiz Methods
  addParticipant(id: string, socketId: string, nickname: string, participantId: string): { participant: Participant; count: number } | null {
    const room = this.getRoom(id);
    if (room && room.type === 'quiz') {
      const cleanNickname = nickname.trim();
      
      // Check if participant already exists by participantId (reconnect scenario)
      let participant = room.participants[participantId];
      if (!participant) {
        participant = {
          participantId,
          socketId,
          nickname: cleanNickname,
          joinedAt: Date.now(),
          score: 0,
          correctAnswersCount: 0,
          wrongAnswersCount: 0,
          questionsAnsweredCount: 0,
        };
        room.participants[participantId] = participant;
      } else {
        // Update socketId
        participant.socketId = socketId;
      }

      room.socketToParticipantMap[socketId] = participantId;
      const count = Object.keys(room.participants).length;
      return { participant, count };
    }
    return null;
  }

  removeParticipant(id: string, socketId: string): number {
    const room = this.getRoom(id);
    if (room && room.type === 'quiz') {
      const participantId = room.socketToParticipantMap[socketId];
      delete room.socketToParticipantMap[socketId];
      // Note: We keep participant in room.participants so score/answers aren't lost if they reconnect!
      return Object.keys(room.participants).length;
    }
    return 0;
  }

  setQuizState(id: string, updates: Partial<QuizRoom>): QuizRoom | null {
    const room = this.getRoom(id);
    if (room && room.type === 'quiz') {
      Object.assign(room, updates);
      return room;
    }
    return null;
  }

  submitAnswer(id: string, participantId: string, questionIndex: number, optionIndex: number): boolean {
    const room = this.getRoom(id);
    if (!room || room.type !== 'quiz') return false;

    // Must be answersOpen
    if (!room.answersOpen) return false;

    // Validate questionIndex
    if (questionIndex !== room.currentQuestion || questionIndex < 1 || questionIndex > room.totalQuestions) {
      return false;
    }

    if (!room.answers[questionIndex]) {
      room.answers[questionIndex] = {};
    }

    // Check duplicate submission
    if (room.answers[questionIndex][participantId] !== undefined) {
      return false; // Duplicate submission rejected
    }

    room.answers[questionIndex][participantId] = optionIndex;
    return true;
  }

  calculateScoresAndStats(id: string, questionIndex: number): {
    correctOption: number;
    distribution: Record<number, number>;
    leaderboard: Array<{ nickname: string; score: number; rank: number }>;
  } | null {
    const room = this.getRoom(id);
    if (!room || room.type !== 'quiz') return null;

    const q = room.questions[questionIndex - 1];
    if (!q) return null;

    const correctOption = q.correctOption;
    const points = q.points || 10;
    const questionAnswers = room.answers[questionIndex] || {};

    const distribution: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0 };

    // Update participant scores for this question
    Object.entries(questionAnswers).forEach(([partId, chosenOpt]) => {
      distribution[chosenOpt] = (distribution[chosenOpt] || 0) + 1;

      const participant = room.participants[partId];
      if (participant) {
        // We evaluate score only once per question
        // To avoid re-scoring on repeated view, we can check if they were scored for this question or calculate from scratch.
      }
    });

    // Recalculate scores from scratch across all answered questions to ensure accurate authoritative score
    Object.values(room.participants).forEach((participant) => {
      let score = 0;
      let correct = 0;
      let wrong = 0;
      let answered = 0;

      for (let qIdx = 1; qIdx <= room.totalQuestions; qIdx++) {
        const pAnswer = room.answers[qIdx]?.[participant.participantId];
        if (pAnswer !== undefined) {
          answered++;
          const qObj = room.questions[qIdx - 1];
          if (qObj && pAnswer === qObj.correctOption) {
            correct++;
            score += qObj.points || 10;
          } else {
            wrong++;
          }
        }
      }

      participant.score = score;
      participant.correctAnswersCount = correct;
      participant.wrongAnswersCount = wrong;
      participant.questionsAnsweredCount = answered;
    });

    // Generate Leaderboard
    const sortedParticipants = Object.values(room.participants)
      .sort((a, b) => b.score - a.score || a.joinedAt - b.joinedAt);

    const leaderboard = sortedParticipants.map((p, idx) => ({
      nickname: p.nickname,
      score: p.score,
      rank: idx + 1,
    }));

    return {
      correctOption,
      distribution,
      leaderboard,
    };
  }

  getQuizResultsCSV(id: string): string | null {
    const room = this.getRoom(id);
    if (!room || room.type !== 'quiz') return null;

    const headers = ['Nickname', 'Score', 'Correct Answers', 'Wrong Answers', 'Questions Answered'];
    const rows: string[] = [headers.join(',')];

    const sortedParticipants = Object.values(room.participants)
      .sort((a, b) => b.score - a.score);

    for (const p of sortedParticipants) {
      const escapeCsv = (str: string) => `"${str.replace(/"/g, '""')}"`;
      rows.push([
        escapeCsv(p.nickname),
        p.score,
        p.correctAnswersCount,
        p.wrongAnswersCount,
        p.questionsAnsweredCount,
      ].join(','));
    }

    return rows.join('\n');
  }

  cleanExpiredRooms(expirationMinutes: number): string[] {
    const now = Date.now();
    const thresholdMs = expirationMinutes * 60 * 1000;
    const expiredIds: string[] = [];

    this.rooms.forEach((room, id) => {
      // Expiration check: if admin is disconnected AND lastAdminSeenAt is older than threshold
      if (!room.adminConnected && (now - room.lastAdminSeenAt > thresholdMs)) {
        expiredIds.push(id);
      }
    });

    expiredIds.forEach((id) => this.rooms.delete(id));
    return expiredIds;
  }
}

export const roomStore = new MemoryRoomStore();
