import { io } from 'socket.io-client';

const SOCKET_URL = "https://hrms-backend-monk.onrender.com/api/v1";

let socket = null;

export function connectAdminSocket(token, userId) {
  if (socket) return socket;

  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 5,
  });

  socket.on('connect', () => {
    console.log('🔌 Admin socket connected:', socket.id);
    socket.emit('register', userId);
  });

  socket.on('connect_error', (err) => {
    console.log('Admin socket error:', err.message);
  });

  return socket;
}

export function disconnectAdminSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

// ---- Ticket events ----
export function listenTicketNew(callback) {
  if (!socket) return;
  socket.on('ticket:new', callback);
}
export function removeTicketNewListener(callback) {
  if (!socket) return;
  socket.off('ticket:new', callback);
}

export function listenTicketUpdated(callback) {
  if (!socket) return;
  socket.on('ticket:updated', callback);
}
export function removeTicketUpdatedListener(callback) {
  if (!socket) return;
  socket.off('ticket:updated', callback);
}

// ---- Leave events ----
export function listenLeaveNew(callback) {
  if (!socket) return;
  socket.on('leave:new', callback);
}
export function removeLeaveNewListener(callback) {
  if (!socket) return;
  socket.off('leave:new', callback);
}

export function listenLeaveUpdated(callback) {
  if (!socket) return;
  socket.on('leave:updated', callback);
}
export function removeLeaveUpdatedListener(callback) {
  if (!socket) return;
  socket.off('leave:updated', callback);
}

// ---- Generic notification event (bell ke liye — sab types cover karega) ----
export function listenNotificationNew(callback) {
  if (!socket) return;
  socket.on('notification:new', callback);
}
export function removeNotificationNewListener(callback) {
  if (!socket) return;
  socket.off('notification:new', callback);
}