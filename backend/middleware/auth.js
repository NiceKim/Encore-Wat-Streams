const jwt = require('jsonwebtoken'); 
const { isBlacklisted } = require('./tokenBlacklist');

const verifyToken = (req, res, next) => {
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
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid Token.' });
    }
};

module.exports = { verifyToken };