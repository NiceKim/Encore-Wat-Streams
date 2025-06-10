const express = require('express');
const router = express.Router();
const { register, login, logout, getUserDetail, updateUserDetail } = require('../controllers/userController');
const { verifyToken } = require('../middleware/auth');


router.post('/register', register);
router.post('/login', login);
router.post('/logout', verifyToken, logout);

router.get('/detail', verifyToken, getUserDetail);
router.put('/detail', verifyToken, updateUserDetail);

module.exports = router;






