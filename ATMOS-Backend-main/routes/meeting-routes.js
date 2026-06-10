const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const {
  createMeetingRoom,
  getUserMeetingRooms,
  getMeetingRoomByCode,
} = require('../controllers/meeting-controller');

router.use(auth);

router.post('/create', createMeetingRoom);
router.get('/mine', getUserMeetingRooms);
router.get('/room/:roomCode', getMeetingRoomByCode);

module.exports = router;
