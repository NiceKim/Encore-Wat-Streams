const jwt = require('jsonwebtoken'); 
const { isBlacklisted } = require('./tokenBlacklist');
const env = require('dotenv');
env.config();

const verifyToken = (req, res, next) => {
    const USE_SAMPLE_DB = process.env.USE_SAMPLE_DB;
    if (USE_SAMPLE_DB && USE_SAMPLE_DB.toString().toLowerCase() === 'true') {
      req.user = {
        user_id: 1,
        name: 'Sample User',
        email: 'sample@example.com',
        role: 'USER'
      }
      console.log('⚠️ Warning: Using sample user authentication');
      return next();
    }
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Need authentication Token.' });
    }
    if (isBlacklisted(token)) {
      return res.status(401).json({ message: 'Token is blacklisted.' });
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      return next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid Token.' });
    }
};

module.exports = { verifyToken };