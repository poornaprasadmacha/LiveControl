import { Room, PublicRoomState, Participant } from '../../types';

export function getPublicRoomState(
  room: Room,
  socketId?: string
): PublicRoomState {
  if (room.type === 'presentation') {
    return {
      id: room.id,
      type: 'presentation',
      title: room.title,
      currentSlide: room.currentSlide,
      totalSlides: room.totalSlides,
      isBlank: room.isBlank,
      adminConnected: room.adminConnected,
      viewerCount: Object.keys(room.viewers).length,
    };
  } else {
    const participantId = socketId ? room.socketToParticipantMap[socketId] : undefined;
    const participant: Participant | undefined = participantId ? room.participants[participantId] : undefined;

    const currentQIndex = room.currentQuestion;
    const currentQ = currentQIndex > 0 ? room.questions[currentQIndex - 1] : null;

    let currentQuestionData = null;
    if (currentQ) {
      currentQuestionData = {
        id: currentQ.id,
        question: currentQ.question,
        options: currentQ.options,
      };
    }

    let userAnswer: number | undefined = undefined;
    if (participantId && currentQIndex > 0 && room.answers[currentQIndex]) {
      userAnswer = room.answers[currentQIndex][participantId];
    }

    let answerStats: Record<number, number> | undefined = undefined;
    let correctOption: number | undefined = undefined;

    if (room.resultsRevealed && currentQ) {
      correctOption = currentQ.correctOption;
      const qAnswers = room.answers[currentQIndex] || {};
      answerStats = { 0: 0, 1: 0, 2: 0, 3: 0 };
      Object.values(qAnswers).forEach((opt) => {
        answerStats![opt] = (answerStats![opt] || 0) + 1;
      });
    }

    let leaderboard: Array<{ nickname: string; score: number; rank: number }> | undefined = undefined;
    if (room.leaderboardVisible) {
      const sorted = Object.values(room.participants).sort((a, b) => b.score - a.score || a.joinedAt - b.joinedAt);
      leaderboard = sorted.map((p, idx) => ({
        nickname: p.nickname,
        score: p.score,
        rank: idx + 1,
      }));
    }

    return {
      id: room.id,
      type: 'quiz',
      title: room.title,
      currentQuestion: room.currentQuestion,
      totalQuestions: room.totalQuestions,
      answersOpen: room.answersOpen,
      resultsRevealed: room.resultsRevealed,
      leaderboardVisible: room.leaderboardVisible,
      endsAt: room.endsAt,
      adminConnected: room.adminConnected,
      participantCount: Object.keys(room.participants).length,
      currentQuestionData,
      userAnswer,
      userScore: participant?.score,
      correctOption,
      answerStats,
      leaderboard,
    };
  }
}
