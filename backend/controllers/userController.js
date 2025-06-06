const db = require('../../database/sample_db.js');

// User Registration
const register = async (req, res) => {
  try {
    const { email, name, password } = req.body;
    await db.registerUser({ email, name, password });
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
  res.status(200).json({ message: 'logged out.'});
};

// Check the list of shows
const getShows = async (req, res) => {
  try {
    const shows = awaitdb.getShows();
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


module.exports = { register, login, logout, getShows, getShowById, getShowSchedules};

