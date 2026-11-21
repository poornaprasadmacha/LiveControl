import { io, Socket } from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents } from '../types/socket';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || 'http://localhost:3001';

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(SOCKET_URL, {
  autoConnect: false,
  transports: ['websocket', 'polling'], // WebSocket prioritized first for instant sub-10ms sync
  upgrade: true,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 300,
  reconnectionDelayMax: 1500,
  timeout: 6000,
});
