// Socket.IO signaling server for WebRTC
// Handles room management and peer-to-peer signaling only.
// Video/audio streams go directly peer-to-peer via WebRTC.

const socketHandler = (io) => {
  // Track users in each room: roomId -> Set of socket IDs
  const rooms = new Map();

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Client joins a room
    socket.on('join-room', (roomId) => {
      socket.join(roomId);

      if (!rooms.has(roomId)) {
        rooms.set(roomId, new Set());
      }
      rooms.get(roomId).add(socket.id);

      // Notify others in the room that a new user joined
      socket.to(roomId).emit('user-joined', { socketId: socket.id });

      console.log(`Socket ${socket.id} joined room ${roomId}`);
    });

    // Relay SDP offer to the target peer
    socket.on('offer', ({ offer, to }) => {
      io.to(to).emit('offer', { offer, from: socket.id });
    });

    // Relay SDP answer to the target peer
    socket.on('answer', ({ answer, to }) => {
      io.to(to).emit('answer', { answer, from: socket.id });
    });

    // Relay ICE candidate to the target peer
    socket.on('ice-candidate', ({ candidate, to }) => {
      io.to(to).emit('ice-candidate', { candidate, from: socket.id });
    });

    // Client leaves a room explicitly
    socket.on('leave-room', (roomId) => {
      handleLeaveRoom(socket, roomId);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      rooms.forEach((members, roomId) => {
        if (members.has(socket.id)) {
          handleLeaveRoom(socket, roomId);
        }
      });
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  function handleLeaveRoom(socket, roomId) {
    socket.leave(roomId);
    if (rooms.has(roomId)) {
      rooms.get(roomId).delete(socket.id);
      if (rooms.get(roomId).size === 0) {
        rooms.delete(roomId);
      }
    }
    // Notify others that this user left
    socket.to(roomId).emit('user-left', { socketId: socket.id });
    console.log(`Socket ${socket.id} left room ${roomId}`);
  }
};

module.exports = socketHandler;
