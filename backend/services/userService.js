const pool = require('../config/db');
const bcrypt = require('bcryptjs');

// ✅ User Registration
const registerUser = async ({ email, name, password }) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  if (rows.length > 0) {
    throw new Error('Email already exists.');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  await pool.query(
    'INSERT INTO users (email, name, password, type, registration_date) VALUES (?, ?, ?, ?, NOW())',
    [email, name, hashedPassword, 'USER']
  );
};

// ✅ User Login
const loginUser = async ({ email, password }) => {
  // 1) Find User by email 
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  if (rows.length === 0) {
    throw new Error('Email does not exists.');
  }

  const user = rows[0];

  // 2) Verify Password 
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Password is incorrect');
  }

  // 3) Success Login
  return 'Login Success!';
};

module.exports = { registerUser, loginUser };
