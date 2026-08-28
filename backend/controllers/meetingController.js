const { v4: uuidv4 } = require('uuid');
const { getIsConnected } = require('../config/db');

const getMongoMeeting = () => require('../models/Meeting');
const mem = require('../store/memoryStore');

// @route POST /api/meetings
const createMeeting = async (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ message: 'Meeting title is required' });

  const roomId = uuidv4().slice(0, 8);

  if (getIsConnected()) {
    const Meeting = getMongoMeeting();
    const meeting = await Meeting.create({
      roomId,
      title,
      createdBy: req.user._id,
      participants: [req.user._id],
    });
    return res.status(201).json(meeting);
  }

  const meeting = mem.createMeeting({ roomId, title, createdBy: req.user._id });
  return res.status(201).json(meeting);
};

// @route GET /api/meetings
const getMyMeetings = async (req, res) => {
  if (getIsConnected()) {
    const Meeting = getMongoMeeting();
    const meetings = await Meeting.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email');
    return res.json(meetings);
  }

  return res.json(mem.getMeetingsByUser(req.user._id));
};

// @route GET /api/meetings/:roomId
const getMeetingByRoomId = async (req, res) => {
  if (getIsConnected()) {
    const Meeting = getMongoMeeting();
    const meeting = await Meeting.findOne({ roomId: req.params.roomId }).populate(
      'createdBy',
      'name email'
    );
    if (!meeting) return res.status(404).json({ message: 'Meeting not found' });
    return res.json(meeting);
  }

  const meeting = mem.getMeetingByRoomId(req.params.roomId);
  if (!meeting) return res.status(404).json({ message: 'Meeting not found' });
  return res.json(meeting);
};

module.exports = { createMeeting, getMyMeetings, getMeetingByRoomId };
