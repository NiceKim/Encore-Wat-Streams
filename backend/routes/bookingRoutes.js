const express = require('express');
const router = express.Router();
const { getBookings, createBooking, deleteBooking } = require('../controllers/bookingController');
const { verifyToken } = require('../middleware/auth');

router.post('/',verifyToken, createBooking);
router.get('/',verifyToken, getBookings);
router.delete('/:id',verifyToken, deleteBooking);

module.exports = router;
