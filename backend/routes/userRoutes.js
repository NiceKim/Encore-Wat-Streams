const express = require('express');
const router = express.Router();
const { register, login, logout} = require('../controllers/userController');
const { verifyToken } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', verifyToken, logout);

module.exports = router;






