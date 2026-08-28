# VIDEO-CONFERENCING-PLATFORM

A full-stack real-time video conferencing application built with MERN stack and WebRTC.

## Features

- JWT-based user authentication (register, login, logout)
- Create and manage meeting rooms with unique Room IDs
- Real peer-to-peer video/audio via WebRTC (RTCPeerConnection)
- Socket.IO signaling server (offer/answer/ICE exchange)
- Microphone and camera toggle controls
- Responsive UI for desktop and mobile

## Tech Stack

| Layer     | Technologies                                      |
|-----------|---------------------------------------------------|
| Frontend  | React + Vite, React Router, Axios, Socket.IO Client |
| Backend   | Node.js, Express.js, Socket.IO                   |
| Database  | MongoDB with Mongoose                            |
| Auth      | JWT + bcryptjs                                   |
| Video     | WebRTC (getUserMedia, RTCPeerConnection)         |

## Architecture Overview

```
Browser A                  Signaling Server (Socket.IO)            Browser B
   |                               |                                    |
   |--- join-room ---------------->|                                    |
   |                               |<--- join-room -------------------- |
   |                               |--- user-joined ------------------>  |
   |--- offer (SDP) -------------->|--- offer (SDP) -----------------> |
   |                               |<--- answer (SDP) ----------------- |
   |<-- answer (SDP) -------------|                                    |
   |--- ICE candidates ----------->|--- ICE candidates --------------> |
   |<====== Direct P2P WebRTC Video/Audio Stream ===================>  |
```

## Folder Structure

```
VIDEO-CONFERENCING-PLATFORM/
├── backend/
│   ├── config/db.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── socket/socketHandler.js
│   ├── utils/generateToken.js
│   └── server.js
├── frontend/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── hooks/useWebRTC.js
│       ├── pages/
│       └── services/
├── postman/
├── .gitignore
├── README.md
└── API_DOCUMENTATION.md
```

## Installation

### Prerequisites
- Node.js v18+
- MongoDB (local or MongoDB Atlas)

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env and add your MongoDB URI and JWT secret
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

Create `backend/.env`:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/videoconferencing
JWT_SECRET=your_secure_random_secret_here
CLIENT_URL=http://localhost:5173
```

## Running the App

1. Start the backend: `cd backend && npm run dev` (runs on port 5000)
2. Start the frontend: `cd frontend && npm run dev` (runs on port 5173)
3. Open `http://localhost:5173` in your browser

## API Overview

| Method | Endpoint               | Auth | Description          |
|--------|------------------------|------|----------------------|
| POST   | /api/auth/register     | No   | Register user        |
| POST   | /api/auth/login        | No   | Login user           |
| GET    | /api/auth/profile      | Yes  | Get user profile     |
| POST   | /api/meetings          | Yes  | Create meeting       |
| GET    | /api/meetings          | Yes  | Get my meetings      |
| GET    | /api/meetings/:roomId  | Yes  | Get meeting by ID    |

## WebRTC & Socket.IO Explanation

Socket.IO is used **only for signaling** — exchanging SDP offers/answers and ICE candidates to establish the WebRTC connection. Once connected, all video and audio streams travel **directly peer-to-peer** via WebRTC, not through the server.

### Socket Events

| Direction        | Event           | Purpose                         |
|------------------|-----------------|---------------------------------|
| Client → Server  | `join-room`     | Join a signaling room           |
| Client → Server  | `offer`         | Send SDP offer to peer          |
| Client → Server  | `answer`        | Send SDP answer to peer         |
| Client → Server  | `ice-candidate` | Send ICE candidate to peer      |
| Client → Server  | `leave-room`    | Leave the room                  |
| Server → Client  | `user-joined`   | Notify that a new user joined   |
| Server → Client  | `offer`         | Relay offer to target peer      |
| Server → Client  | `answer`        | Relay answer to target peer     |
| Server → Client  | `ice-candidate` | Relay ICE candidate             |
| Server → Client  | `user-left`     | Notify that a user left         |

## Testing a Video Call with Two Browser Windows

1. Register two separate accounts (or use two different browsers)
2. In Window 1: Login → Create Meeting → note the Room ID
3. In Window 2: Login → Join Meeting → enter the Room ID
4. Both browsers will request camera/microphone access
5. The WebRTC connection will establish automatically

> Note: Free STUN servers are used for development. In strict NAT/firewall production environments, a TURN server will be required.

## Screenshots

_Add screenshots here_

## Future Improvements

- Multi-participant (mesh or SFU architecture)
- Screen sharing
- Chat messages during calls
- Meeting recording
- TURN server integration for production

## Author

Awadh Lal
