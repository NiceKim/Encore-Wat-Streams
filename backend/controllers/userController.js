const db = require('./dbInterface');
const { addToBlacklist } = require('../middleware/tokenBlacklist');

// User Registration
const register = async (req, res) => {
  try {
    const { email, name, password, user_type } = req.body;
    if (!["USER", "ADMIN"].includes(user_type)) {
      return res.status(400).json({ message: "Type must be 'USER' or 'ADMIN'." });
    }

    await db.registerUser({ email, name, password, user_type });
    res.status(201).json({ message: 'Registration Successed!' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// User Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await db.loginUser({ email, password });
    res.status(200).json(result);
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

// User Logout
const logout = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    addToBlacklist(token);
  }
  res.status(200).json({ message: 'logged out.'});
};

// Check the list of shows
const getShows = async (req, res) => {
  try {
    const shows = await db.getShows();
    res.status(200).json(shows);
  } catch (err) {
    console.error('Error fetching shows:', err);
    res.status(500).json({ message: 'Failed to fetch shows.' });
  }
};

const getShowById = async (req, res) => {
  try {
    const showId = req.params.id;
    const show = await db.getShowById(showId);
    if (!show) {
      return res.status(404).json({ message: 'Show not found.' });
    }
    res.status(200).json(show);
  } catch (err){
    console.error('Error fetching shows:', err);
    res.status(500).json({ message: 'Failed to fetch shows.' });
  }

};

const getShowSchedules = async (req, res) => {
  try {
    const showID = req.params.id;
    const schedules = await db.getShowSchedules(showID)
    if (!schedules) {
      return res.status(404).json({ message: 'Show not found.' });
    }
    res.status(200).json(schedules);
  } catch (err) {
    console.error('Error fetching shows:', err);
    res.status(500).json({ message: 'Failed to fetch showd schedules.' });
  }
};

// Get user detail
const getUserDetail = async (req, res) => {
  try {
    const userId = req.user.id || req.user.userId; // Extract id from token
    const user = await db.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json({
      id: user.user_id,
      name: user.name,
      email: user.email,
      type: user.type,
      registration_date: user.registration_date
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user detail.', error: err.message });
  }
};

// Update user detail
const updateUserDetail = async (req, res) => {
  try {
    const userId = req.user.id || req.user.userId;
    const { name, email, password } = req.body;
    const updatedUser = await db.updateUserById(userId, { name, email, password });
    res.json({ message: 'User detail updated successfully.', user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update user detail.', error: err.message });
  }
};

module.exports = { register, login, logout, getShows, getShowById, getShowSchedules, getUserDetail, updateUserDetail };

