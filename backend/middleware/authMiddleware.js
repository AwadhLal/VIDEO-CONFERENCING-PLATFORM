const jwt = require('jsonwebtoken');
const { getIsConnected } = require('../config/db');
const mem = require('../store/memoryStore');

const protect = async (req, res, next) => {
  let token;

  if (!req.headers.authorization?.startsWith('Bearer')) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret_key');

    if (getIsConnected()) {
      const User = require('../models/User');
      req.user = await User.findById(decoded.id).select('-password');
    } else {
      const user = mem.findUserById(decoded.id);
      if (user) {
        const { password, ...rest } = user;
        req.user = rest;
      }
    }

    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

module.exports = { protect };
