import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { roomStore } from './stores/RoomStore';
import { sessionStore } from './stores/SessionStore';
import { autoCleanupService } from './services/AutoCleanupService';
import { getPublicRoomState } from './utils/roomStateHelper';
import { ClientToServerEvents, ServerToClientEvents } from '../types/socket';
import { QuizRoom } from '../types';

dotenv.config();

const app = express();
const server = http.createServer(app);

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const PORT = process.env.PORT || 3001;
const SYSTEM_ADMIN_PIN = process.env.ADMIN_PIN || 'admin123';

// Permissive CORS middleware for Express & Vercel Preview Deployments
app.use(
  cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
  })
);
app.use(express.json());

// Express REST API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// REST API Endpoint: Create Room (HTTP Fallback)
app.post('/api/create-room', (req, res) => {
  try {
    const { type, title, pin } = req.body;
    const roomPin = pin && pin.trim().length >= 4 ? pin.trim() : SYSTEM_ADMIN_PIN;
    const room = roomStore.createRoom(type || 'presentation', title || 'Untitled Session', roomPin);

    console.log(`✨ Created new ${room.type} room via HTTP REST API: ${room.id} ("${room.title}")`);
    return res.json({
      success: true,
      roomId: room.id,
      adminToken: room.adminToken,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Failed to create room' });
  }
});

// REST API Endpoint: CSV Export
app.get('/api/download-results/:roomId', (req, res) => {
  const roomId = req.params.roomId;
  const room = roomStore.getRoom(roomId);
  if (!room || room.type !== 'quiz') {
    return res.status(404).send('Quiz room not found or session ended.');
  }

  const csv = roomStore.getQuizResultsCSV(roomId);
  if (!csv) {
    return res.status(500).send('Could not generate CSV.');
  }

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="quiz-results-${roomId}.csv"`);
  return res.status(200).send(csv);
});

// Socket.IO Setup with Permissive CORS
const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
  cors: {
    origin: (origin, callback) => callback(null, true),
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Timers map for quiz auto-closing
const quizTimers: Map<string, NodeJS.Timeout> = new Map();

io.on('connection', (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
  const clientIp = socket.handshake.address || 'unknown';

  const verifyAdmin = (roomId: string, token: string): boolean => {
    const room = roomStore.getRoom(roomId);
    if (!room) return false;
    return room.adminToken === token;
  };

  const broadcastRoomState = (roomId: string) => {
    const room = roomStore.getRoom(roomId);
    if (!room) return;

    const roomSockets = io.sockets.adapter.rooms.get(roomId);
    if (roomSockets) {
      roomSockets.forEach((sId) => {
        const clientSocket = io.sockets.sockets.get(sId);
        if (clientSocket) {
          const publicState = getPublicRoomState(room, sId);
          clientSocket.emit('roomState', publicState);
        }
      });
    }
  };

  // 1. Create Room via Socket
  socket.on('createRoom', ({ type, title, pin }, callback) => {
    try {
      const roomPin = pin && pin.trim().length >= 4 ? pin.trim() : SYSTEM_ADMIN_PIN;
      const room = roomStore.createRoom(type, title, roomPin);

      console.log(`✨ Created new ${type} room via Socket: ${room.id} ("${title}")`);
      callback({
        success: true,
        roomId: room.id,
        adminToken: room.adminToken,
      });
    } catch (err: any) {
      callback({ success: false, error: err.message || 'Failed to create room' });
    }
  });

  // 2. Admin Authenticate
  socket.on('adminAuthenticate', ({ roomId, pin }, callback) => {
    if (sessionStore.isRateLimited(clientIp)) {
      return callback({
        success: false,
        error: 'Too many failed login attempts. Please wait 5 minutes before trying again.',
      });
    }

    const room = roomStore.getRoom(roomId);
    if (!room) {
      return callback({ success: false, error: 'Room does not exist or has been deleted.' });
    }

    const isValidPin = pin === room.adminPin || pin === SYSTEM_ADMIN_PIN;

    if (!isValidPin) {
      const rateInfo = sessionStore.recordFailedAttempt(clientIp);
      if (rateInfo.blockedForSeconds) {
        return callback({
          success: false,
          error: `Too many invalid attempts. IP blocked for ${rateInfo.blockedForSeconds} seconds.`,
        });
      }
      return callback({
        success: false,
        error: `Incorrect Admin PIN. (${rateInfo.remainingAttempts} attempts remaining)`,
      });
    }

    sessionStore.recordSuccessfulAuth(clientIp);

    socket.data.role = 'ADMIN';
    socket.data.roomId = room.id;
    socket.data.adminToken = room.adminToken;

    roomStore.updateAdminStatus(room.id, true);
    socket.join(room.id);

    io.to(room.id).emit('adminStatusChanged', { connected: true });
    broadcastRoomState(room.id);

    callback({
      success: true,
      token: room.adminToken,
    });
  });

  // 3. Join Room
  socket.on('joinRoom', ({ roomId, role, token, nickname, participantId }, callback) => {
    const room = roomStore.getRoom(roomId);
    if (!room) {
      return callback({ success: false, error: 'Room not found or session has ended.' });
    }

    socket.data.roomId = room.id;

    if (role === 'ADMIN') {
      if (token !== room.adminToken) {
        return callback({ success: false, error: 'Unauthorized admin token.' });
      }
      socket.data.role = 'ADMIN';
      roomStore.updateAdminStatus(room.id, true);
      socket.join(room.id);
      io.to(room.id).emit('adminStatusChanged', { connected: true });
      const publicState = getPublicRoomState(room, socket.id);
      return callback({ success: true, state: publicState });
    }

    if (role === 'VIEWER') {
      if (room.type !== 'presentation') {
        return callback({ success: false, error: 'Invalid room type for viewer.' });
      }
      socket.data.role = 'VIEWER';
      const count = roomStore.addViewer(room.id, socket.id);
      socket.join(room.id);
      io.to(room.id).emit('viewerCountUpdated', { count });
      const publicState = getPublicRoomState(room, socket.id);
      return callback({ success: true, state: publicState });
    }

    if (role === 'PARTICIPANT') {
      if (room.type !== 'quiz') {
        return callback({ success: false, error: 'Invalid room type for participant.' });
      }

      const cleanNickname = (nickname || '').trim();
      if (!cleanNickname || cleanNickname.length < 2 || cleanNickname.length > 20) {
        return callback({ success: false, error: 'Nickname must be between 2 and 20 characters.' });
      }

      const pId = participantId || `p_${Math.random().toString(36).substring(2, 8)}`;
      socket.data.role = 'PARTICIPANT';
      socket.data.participantId = pId;

      const result = roomStore.addParticipant(room.id, socket.id, cleanNickname, pId);
      if (!result) {
        return callback({ success: false, error: 'Failed to join quiz.' });
      }

      socket.join(room.id);
      io.to(room.id).emit('participantCountUpdated', { count: result.count });
      
      const publicState = getPublicRoomState(room, socket.id);
      return callback({
        success: true,
        participantId: pId,
        state: publicState,
      });
    }

    return callback({ success: false, error: 'Invalid role specified.' });
  });

  // 4. Presentation Controls: Change Slide
  socket.on('changeSlide', ({ roomId, slideIndex, isBlank, token }) => {
    const adminToken = token || socket.data.adminToken;
    if (!verifyAdmin(roomId, adminToken)) {
      return;
    }

    const room = roomStore.setSlide(roomId, slideIndex, isBlank);
    if (room) {
      io.to(roomId).emit('slideChanged', { currentSlide: room.currentSlide, isBlank: room.isBlank });
      broadcastRoomState(roomId);
    }
  });

  // 5. Toggle Blank Screen
  socket.on('toggleBlank', ({ roomId }) => {
    if (!verifyAdmin(roomId, socket.data.adminToken)) return;

    const room = roomStore.toggleBlank(roomId);
    if (room) {
      io.to(roomId).emit('slideChanged', { currentSlide: room.currentSlide, isBlank: room.isBlank });
      broadcastRoomState(roomId);
    }
  });

  // 6. Quiz Controls: Start Quiz
  socket.on('startQuiz', ({ roomId }) => {
    if (!verifyAdmin(roomId, socket.data.adminToken)) return;

    const room = roomStore.setQuizState(roomId, {
      currentQuestion: 1,
      answersOpen: false,
      resultsRevealed: false,
      leaderboardVisible: false,
      endsAt: null,
    });

    if (room) {
      broadcastRoomState(roomId);
    }
  });

  // 7. Change Quiz Question
  socket.on('changeQuestion', ({ roomId, questionIndex }) => {
    if (!verifyAdmin(roomId, socket.data.adminToken)) return;

    if (quizTimers.has(roomId)) {
      clearTimeout(quizTimers.get(roomId)!);
      quizTimers.delete(roomId);
    }

    const room = roomStore.setQuizState(roomId, {
      currentQuestion: questionIndex,
      answersOpen: false,
      resultsRevealed: false,
      leaderboardVisible: false,
      endsAt: null,
    });

    if (room) {
      broadcastRoomState(roomId);
    }
  });

  // 8. Open Quiz Answers
  socket.on('openAnswers', ({ roomId, durationSeconds }) => {
    if (!verifyAdmin(roomId, socket.data.adminToken)) return;

    let endsAt: number | null = null;
    if (durationSeconds && durationSeconds > 0) {
      endsAt = Date.now() + durationSeconds * 1000;

      if (quizTimers.has(roomId)) {
        clearTimeout(quizTimers.get(roomId)!);
      }

      const timer = setTimeout(() => {
        const targetRoom = roomStore.getRoom(roomId);
        if (targetRoom && targetRoom.type === 'quiz' && targetRoom.answersOpen) {
          roomStore.setQuizState(roomId, { answersOpen: false, endsAt: null });
          broadcastRoomState(roomId);
          console.log(`⏱️ Quiz answers auto-closed for room ${roomId}`);
        }
        quizTimers.delete(roomId);
      }, durationSeconds * 1000);

      quizTimers.set(roomId, timer);
    }

    const room = roomStore.setQuizState(roomId, {
      answersOpen: true,
      resultsRevealed: false,
      endsAt,
    });

    if (room) {
      broadcastRoomState(roomId);
    }
  });

  // 9. Close Quiz Answers
  socket.on('closeAnswers', ({ roomId }) => {
    if (!verifyAdmin(roomId, socket.data.adminToken)) return;

    if (quizTimers.has(roomId)) {
      clearTimeout(quizTimers.get(roomId)!);
      quizTimers.delete(roomId);
    }

    const room = roomStore.setQuizState(roomId, {
      answersOpen: false,
      endsAt: null,
    });

    if (room) {
      broadcastRoomState(roomId);
    }
  });

  // 10. Submit Quiz Answer
  socket.on('submitAnswer', ({ roomId, participantId, questionIndex, optionIndex }, callback) => {
    const success = roomStore.submitAnswer(roomId, participantId, questionIndex, optionIndex);
    if (!success) {
      if (callback) callback({ success: false, error: 'Submission rejected (answers closed or already submitted).' });
      return;
    }

    const room = roomStore.getRoom(roomId) as QuizRoom | undefined;
    if (room) {
      const currentAnswers = room.answers[questionIndex] || {};
      const answeredCount = Object.keys(currentAnswers).length;
      const totalCount = Object.keys(room.participants).length;

      const distribution: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0 };
      Object.values(currentAnswers).forEach((opt) => {
        distribution[opt] = (distribution[opt] || 0) + 1;
      });

      io.to(roomId).emit('liveAnswerUpdate', {
        answeredCount,
        totalCount,
        distribution,
      });

      broadcastRoomState(roomId);
    }

    if (callback) callback({ success: true });
  });

  // 11. Reveal Quiz Results
  socket.on('revealResults', ({ roomId }) => {
    if (!verifyAdmin(roomId, socket.data.adminToken)) return;

    const room = roomStore.getRoom(roomId) as QuizRoom | undefined;
    if (!room) return;

    roomStore.setQuizState(roomId, {
      answersOpen: false,
      resultsRevealed: true,
      endsAt: null,
    });

    const stats = roomStore.calculateScoresAndStats(roomId, room.currentQuestion);
    if (stats) {
      const currentQ = room.questions[room.currentQuestion - 1];
      io.to(roomId).emit('resultsRevealed', {
        correctOption: stats.correctOption,
        distribution: stats.distribution,
        explanation: currentQ?.explanation,
      });
    }

    broadcastRoomState(roomId);
  });

  // 12. Show Leaderboard
  socket.on('showLeaderboard', ({ roomId }) => {
    if (!verifyAdmin(roomId, socket.data.adminToken)) return;

    const room = roomStore.getRoom(roomId) as QuizRoom | undefined;
    if (!room) return;

    roomStore.setQuizState(roomId, {
      leaderboardVisible: true,
    });

    const stats = roomStore.calculateScoresAndStats(roomId, room.currentQuestion);
    if (stats) {
      io.to(roomId).emit('leaderboardUpdated', { leaderboard: stats.leaderboard });
    }

    broadcastRoomState(roomId);
  });

  // 13. End & Delete Session
  socket.on('endSession', ({ roomId, token }, callback) => {
    if (!verifyAdmin(roomId, token)) {
      if (callback) callback({ success: false, error: 'Unauthorized.' });
      return;
    }

    console.log(`🛑 Admin explicitly ended session for room: ${roomId}`);

    if (quizTimers.has(roomId)) {
      clearTimeout(quizTimers.get(roomId)!);
      quizTimers.delete(roomId);
    }

    io.to(roomId).emit('sessionEnded', { reason: 'This session has been ended by the host.' });
    io.in(roomId).socketsLeave(roomId);
    roomStore.deleteRoom(roomId);

    if (callback) callback({ success: true });
  });

  // 14. Handle Disconnect
  socket.on('disconnect', () => {
    const roomId = socket.data.roomId;
    const role = socket.data.role;

    if (roomId) {
      const room = roomStore.getRoom(roomId);
      if (room) {
        if (role === 'ADMIN') {
          console.log(`⚠️ Admin disconnected from room: ${roomId}`);
          roomStore.updateAdminStatus(roomId, false);
          io.to(roomId).emit('adminStatusChanged', { connected: false });
          broadcastRoomState(roomId);
        } else if (role === 'VIEWER') {
          const count = roomStore.removeViewer(roomId, socket.id);
          io.to(roomId).emit('viewerCountUpdated', { count });
        } else if (role === 'PARTICIPANT') {
          const count = roomStore.removeParticipant(roomId, socket.id);
          io.to(roomId).emit('participantCountUpdated', { count });
        }
      }
    }
  });
});

autoCleanupService.start(roomStore);

server.listen(PORT, () => {
  console.log(`🚀 LiveControl Socket.IO Backend Server running on port ${PORT}`);
  console.log(`🌐 Configured FRONTEND_URL: ${FRONTEND_URL}`);
  console.log(`🔑 Master ADMIN_PIN: ${SYSTEM_ADMIN_PIN}`);
});
