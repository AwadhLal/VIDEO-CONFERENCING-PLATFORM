import { io } from 'socket.io-client';

// Single socket instance shared across the app
// Connect to backend — adjust port if your backend runs elsewhere
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const socket = io(BACKEND_URL, {
  autoConnect: false,
});

export default socket;
