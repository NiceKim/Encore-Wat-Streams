const express = require('express');
const router = express.Router();
const { getRoomStats } = require('../RTC');
const { verifyToken } = require('../middleware/auth');
const path = require('path');
const db = require('../controllers/dbInterface');

function getStats(req, res) {
  const roomId = req.params.id;
  const stats = getRoomStats(roomId);
  res.json(stats);
}

async function updateStreamStatus(req, res) {
  const admin_id = req.user.user_id;
  // GET SCHEDULES BY ID -> Compare with admin
  const { id } = req.params;
  const { isStreaming: streamingState } = req.body;
  try {
    if (req.user.type !== 'ADMIN') {
      return res.status(403).json({ message: 'You are not authorized to update the streaming status.' });
    }
    const result = await db.query(
      'UPDATE Schedules SET is_streaming = ? WHERE id = ?',
      [streamingState ? 1 : 0, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Can't find the schedule" });
    }
    res.json({ message: 'Stream updated' });
  } catch (error) {
    console.error('Error updatating the stream:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};


router.get('/:id/stats', getStats);
router.put('/:id/status', verifyToken, updateStreamStatus);

router.get('/broadcast', verifyToken, (req, res) => {
  const { id } = req.query;
  if (req.user.type === 'ADMIN') {
    if (!id) {
      return res.status(400).json({ message: 'need id parameter' });
    }
    res.sendFile(path.join(__dirname, '../private/views/stream-streamer.html'));
  } else {
    res.sendFile(path.join(__dirname, '../../frontend/access-denied.html'));
  }
});


module.exports = router; 