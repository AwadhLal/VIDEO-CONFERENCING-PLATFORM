// In-memory fallback store — used when MongoDB is not available.
// Data resets on server restart.
// To use MongoDB permanently, set MONGODB_URI in backend/.env

const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const users = [];
const meetings = [];

// ── USERS ──────────────────────────────────────────────────────────────────

const findUserByEmail = (email) =>
  users.find((u) => u.email === email.toLowerCase());

const findUserById = (id) => users.find((u) => u._id === id);

const createUser = async ({ name, email, password }) => {
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);
  const user = {
    _id: uuidv4(),
    name,
    email: email.toLowerCase(),
    password: hashed,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  return user;
};

const matchPassword = async (plainText, hashed) =>
  bcrypt.compare(plainText, hashed);

// ── MEETINGS ───────────────────────────────────────────────────────────────

const createMeeting = ({ roomId, title, createdBy }) => {
  const meeting = {
    _id: uuidv4(),
    roomId,
    title,
    createdBy,
    participants: [createdBy],
    createdAt: new Date().toISOString(),
  };
  meetings.push(meeting);
  return meeting;
};

const getMeetingsByUser = (userId) =>
  meetings
    .filter((m) => m.createdBy === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map((m) => ({ ...m, createdBy: safeUser(findUserById(m.createdBy)) }));

const getMeetingByRoomId = (roomId) => {
  const m = meetings.find((m) => m.roomId === roomId);
  if (!m) return null;
  return { ...m, createdBy: safeUser(findUserById(m.createdBy)) };
};

const safeUser = (u) => {
  if (!u) return null;
  const { password, ...rest } = u;
  return rest;
};

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  matchPassword,
  createMeeting,
  getMeetingsByUser,
  getMeetingByRoomId,
  safeUser,
};
