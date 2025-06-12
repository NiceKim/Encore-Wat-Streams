const express = require('express');
const router = express.Router();
const { getShows, getShowById, getShowSchedules, getStreamingSchedules, getPictures } = require('../controllers/userController');
// const { verifyToken } = require('../middleware/auth');

// Check the list of shows(Need Authentication)
router.get('/', getShows);
router.get('/:id', getShowById);
router.get('/:id/schedules', getShowSchedules);
router.get('/schedules/streaming', getStreamingSchedules);
router.get('/:id/pictures',getPictures);
// router.post('/:id/pictures',uploadPicture);
module.exports = router;