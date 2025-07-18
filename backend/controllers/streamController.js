const { getRoomStats } = require('../RTC');
const db = require('./dbInterface');

function getStats(req, res) {
  const roomId = req.params.id;
  const stats = getRoomStats(roomId);
  res.json(stats);
}

async function updateStreamStatus(req, res) {
  const { id } = req.params;
  const admin_id = req.user.user_id;
  const userType = req.user.user_type;
  const schedule = await db.getScheduleById(id);

  const { isStreaming } = req.body;
  try {
    if (userType !== 'ADMIN') {
      return res.status(403).json({ message: 'You are not authorized to update the streaming status.' });
    }

    if (schedule.admin_id !== admin_id) {
      return res.status(403).json({ message: 'Only the admin who created the schedule can delete it.' });
    }

    const result = await db.updateStreamStatus(id, isStreaming ? 1 : 0);
  
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Can't find the schedule" });
    }
    res.json({ message: 'Stream updated' });
  } catch (error) {
    console.error('Error updatating the stream:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = {
  getStats,
  updateStreamStatus
}; 