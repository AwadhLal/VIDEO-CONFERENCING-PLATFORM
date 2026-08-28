const Meeting = require('../models/Meeting');
const { v4: uuidv4 } = require('uuid');

// @desc    Create a new meeting
// @route   POST /api/meetings
const createMeeting = async (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Meeting title is required' });
  }

  const roomId = uuidv4().slice(0, 8);

  const meeting = await Meeting.create({
    roomId,
    title,
    createdBy: req.user._id,
    participants: [req.user._id],
  });

  res.status(201).json(meeting);
};

// @desc    Get meetings created by current user
// @route   GET /api/meetings
const getMyMeetings = async (req, res) => {
  const meetings = await Meeting.find({ createdBy: req.user._id })
    .sort({ createdAt: -1 })
    .populate('createdBy', 'name email');

  res.json(meetings);
};

// @desc    Get meeting by roomId
// @route   GET /api/meetings/:roomId
const getMeetingByRoomId = async (req, res) => {
  const meeting = await Meeting.findOne({ roomId: req.params.roomId }).populate(
    'createdBy',
    'name email'
  );

  if (!meeting) {
    return res.status(404).json({ message: 'Meeting not found' });
  }

  res.json(meeting);
};

module.exports = { createMeeting, getMyMeetings, getMeetingByRoomId };
