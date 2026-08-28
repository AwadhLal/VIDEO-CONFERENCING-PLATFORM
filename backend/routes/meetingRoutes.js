const express = require('express');
const router = express.Router();
const { createMeeting, getMyMeetings, getMeetingByRoomId } = require('../controllers/meetingController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createMeeting);
router.get('/', protect, getMyMeetings);
router.get('/:roomId', protect, getMeetingByRoomId);

module.exports = router;
