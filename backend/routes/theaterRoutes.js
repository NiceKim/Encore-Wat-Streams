const express = require('express');
const router = express.Router();
const { createShow, createSchedule, updateShow, deleteShow, updateSchedule, deleteSchedule } = require('../controllers/theaterController');
const { verifyToken } = require('../middleware/auth');

// Theater management endpoints
router.post('/shows', verifyToken, createShow);
router.put('/shows/:id', verifyToken, updateShow);
router.delete('/shows/:id', verifyToken, deleteShow);
router.post('/schedules', verifyToken, createSchedule);
router.put('/schedules/:id', verifyToken, updateSchedule);
router.delete('/schedules/:id', verifyToken, deleteSchedule);

module.exports = router; 