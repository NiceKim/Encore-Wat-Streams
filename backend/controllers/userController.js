const { registerUser, loginUser } = require('../services/userService');

// User Registration
const register = async (req, res) => {
  try {
    const { email, name, password } = req.body;
    await registerUser({ email, name, password });
    res.status(201).json({ message: 'Registration Successed!' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// User Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser({ email, password });
    res.status(200).json({ message: result });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

module.exports = { register, login };

