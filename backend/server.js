require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const meetingRoutes = require('./routes/meetingRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');
const socketHandler = require('./socket/socketHandler');

// Connect to MongoDB
connectDB();

const app = express();

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json());

// REST API routes
app.use('/api/auth', authRoutes);
app.use('/api/meetings', meetingRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK' }));

// Error handler
app.use(errorHandler);

// Create HTTP server and attach Socket.IO
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

socketHandler(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
