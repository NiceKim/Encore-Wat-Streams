const express = require('express');
const router = express.Router();
const { getBookings, createBooking, deleteBooking } = require('../controllers/bookingController');
const { verifyToken } = require('../middleware/auth');

router.get('/',verifyToken, getBookings);
router.post('/',verifyToken, createBooking);
router.delete('/:id',verifyToken, deleteBooking);

module.exports = router;
