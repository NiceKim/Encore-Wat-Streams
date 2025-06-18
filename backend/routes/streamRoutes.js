const express = require('express');
const router = express.Router();
const { getStats, updateStreamStatus } = require('../controllers/streamController');
const { verifyToken } = require('../middleware/auth');

router.get('/:id/stats', getStats);
router.put('/:id/status', verifyToken, updateStreamStatus);

module.exports = router; 