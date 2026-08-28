const generateToken = require('../utils/generateToken');
const { getIsConnected } = require('../config/db');

// Lazy-load so we don't crash if mongoose isn't connected
const getMongoUser = () => require('../models/User');
const mem = require('../store/memoryStore');

// @route POST /api/auth/register
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide all fields' });
  }

  if (getIsConnected()) {
    // ── MongoDB path ────────────────────────────────────────────────────────
    const User = getMongoUser();
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password });
    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  }

  // ── In-memory path ────────────────────────────────────────────────────────
  if (mem.findUserByEmail(email)) {
    return res.status(400).json({ message: 'User already exists' });
  }
  const user = await mem.createUser({ name, email, password });
  return res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  });
};

// @route POST /api/auth/login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  if (getIsConnected()) {
    const User = getMongoUser();
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  }

  const user = mem.findUserByEmail(email);
  if (!user || !(await mem.matchPassword(password, user.password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  return res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  });
};

// @route GET /api/auth/profile
const getUserProfile = (req, res) => {
  const { _id, name, email, createdAt } = req.user;
  res.json({ _id, name, email, createdAt });
};

module.exports = { registerUser, loginUser, getUserProfile };
