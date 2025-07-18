const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
require('dotenv').config();

// ✅ Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// ✅ Get all shows
const getShows = async () => {
  const [rows] = await pool.query(
    'SELECT * FROM shows LIMIT 10'
  );
  return rows;
};

// ✅ Get show by ID
const getShowById = async (showID) => {
  const [rows] = await pool.query(
    'SELECT * FROM shows WHERE show_id = ?',
    [showID]
  );
  if (rows.length === 0) throw new Error('Show not found');
  return rows[0];
};

// ✅ Get shows by multiple IDs
const getShowsByIDs = async (ids) => {
  if (!Array.isArray(ids) || ids.length === 0) return [];
  const placeholders = ids.map(() => '?').join(',');
  const [rows] = await pool.query(
    `SELECT * FROM shows WHERE show_id IN (${placeholders})`,
    ids
  );
  return rows;
};



// ✅ Get schedules for a show
const getShowSchedules = async (showID) => {
  const [rows] = await pool.query(
    `SELECT 
       schedule_id AS Schedule_ID, 
       show_id AS Show_ID, 
       date AS Date, 
       location AS Location, 
       is_streaming AS IsStreaming
     FROM schedules
     WHERE show_id = ?`,
    [showID]
  );
  return rows;
};

// ✅ User registration
const registerUser = async ({ email, name, password, user_type = 'viewer' }) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  if (rows.length > 0) throw new Error('Email already exists.');

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  await pool.query(
    'INSERT INTO users (email, name, password, user_type, registration_date) VALUES (?, ?, ?, ?, NOW())',
    [email, name, hashedPassword, user_type]
  );
};

// ✅ User login
const loginUser = async ({ email, password }) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  if (rows.length === 0) throw new Error('Email does not exist.');

  const user = rows[0];
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Password is incorrect');

  const token = jwt.sign(
    {
      user_id: user.user_id,
      email: user.email,
      user_type: user.user_type
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  return {
    token,
    user: {
      user_id: user.user_id,
      email: user.email,
      name: user.name,
      user_type: user.user_type
    }
  };
};

// ✅ Create a new show
const createShow = async ({ admin_id, title, description, category, price, thumbnail }) => {
  const [result] = await pool.query(
    `INSERT INTO shows (admin_id, title, description, category, price, thumbnail)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [admin_id, title, description, category, price, thumbnail]
  );

  const showId = result.insertId;

  return {
    Show_ID: showId,
    Title: title,
    Description: description,
    Category: category,
    Price: price,
    Thumbnail: thumbnail
  };
};

// ✅ Create a new schedule
const createSchedule = async ({ admin_id, show_id, date, location }) => {
  const [result] = await pool.query(
    `INSERT INTO schedules (admin_id, show_id, date, location, is_streaming)
     VALUES (?, ?, ?, ?, 0)`,
    [admin_id, show_id, date, location]
  );

  const scheduleId = result.insertId;

  return {
    schedule_id: scheduleId,
    admin_id,
    show_id,
    date,
    location,
    is_streaming: 0
  };
};

// ✅ Update a show
const updateShow = async ({ showId, title, description, category, price, thumbnail }) => {
  const [result] = await pool.query(
    `UPDATE shows
     SET title = ?, description = ?, category = ?, price = ?, thumbnail = ?
     WHERE show_id = ?`,
    [title, description, category, price, thumbnail, showId]
  );

  if (result.affectedRows === 0) {
    throw new Error(`Show with ID ${showId} not found.`);
  }

  return {
    Show_ID: Number(showId),
    Title: title,
    Description: description,
    Category: category,
    Price: price,
    Thumbnail: thumbnail
  };
};

// ✅ Delete a show
const deleteShow = async (showId) => {
  const [result] = await pool.query(
    `DELETE FROM shows WHERE show_id = ?`,
    [showId]
  );
  if (result.affectedRows === 0) throw new Error(`Show with ID ${showId} not found.`);
  return true;
};

// ✅ Update a schedule
const updateSchedule = async ({ scheduleId, show_id, date, location, is_streaming }) => {
  const [result] = await pool.query(
    `UPDATE schedules
     SET show_id = ?, date = ?, location = ?, is_streaming = ?
     WHERE schedule_id = ?`,
    [show_id, date, location, is_streaming, scheduleId]
  );

  if (result.affectedRows === 0) {
    throw new Error(`Schedule with ID ${scheduleId} not found.`);
  }

  return {
    Schedule_ID: Number(scheduleId),
    Show_ID: show_id,
    Date: date,
    Location: location,
    IsStreaming: is_streaming
  };
};

// ✅ Delete a schedule
const deleteSchedule = async (scheduleId) => {
  const [result] = await pool.query(
    `DELETE FROM schedules WHERE schedule_id = ?`,
    [scheduleId]
  );
  if (result.affectedRows === 0) throw new Error(`Schedule with ID ${scheduleId} not found.`);
  return true;
};

// ✅ Create a booking
const createBooking = async ({ user_id, schedule_id }) => {
  const [result] = await pool.query(
    `INSERT INTO bookings (user_id, schedule_id)
     VALUES (?, ?)`,
    [user_id, schedule_id]
  );

  return {
    Booking_ID: result.insertId,
    User_ID: user_id,
    Schedule_ID: schedule_id
  };
};

// ✅ Get bookings for a user
const getBookingsByUserId = async (user_id) => {
  const [rows] = await pool.query('SELECT * FROM bookings WHERE user_id = ?', [user_id]);
  return rows;
};

// ✅  Get user by ID
const getUserById = async (userId) => {
  const [result] = await pool.query(
    `SELECT * FROM USERS WHERE user_id = ?`,
    [userId]
  );
  if (result.affectedRows === 0) throw new Error(`User with ID${userId} not found.`);
  return result[0];
};

// ✅ Update user by ID
const updateUserById = async (userId, { name, email, password }) => {
  let query = 'UPDATE users SET name = ?, email = ?';
  let params = [name, email];

  if (password) {
    query += ', password = ?';
    params.push(password);
  }
  query += ' WHERE user_id = ?';
  params.push(userId);

  const [result] = await pool.query(query, params);
  if (result.affectedRows === 0) throw new Error(`User with ID ${userId} not found.`);
  return true;
};

// ✅ Get schedule by ID
const getScheduleById = async (scheduleId) => {
  const [rows] = await pool.query(
    'SELECT * FROM schedules WHERE schedule_id = ?',
    [scheduleId]
  );
  if (rows.length === 0) return null;
  return rows[0];
};

// ✅ Get pictures for a show
const getPicturesByShowId = async (showId) => {
  const [rows] = await pool.query(
    `SELECT picture_id AS Picture_ID, show_id AS Show_ID, image_url AS ImageURL
     FROM pictures
     WHERE show_id = ?`,
    [showId]
  );
  return rows;
};

// ✅ Delete a booking
const deleteBooking = async (booking_id) => {
  const [result] = await pool.query(
    'DELETE FROM bookings WHERE booking_id = ?',
    [booking_id]
  );
  return result.affectedRows > 0;
};

const getStreamingSchedules = async () => {
  const [rows] = await pool.query(
    'SELECT * FROM schedules WHERE is_streaming = 1'
  );
  return rows;
};

const getPictures = async (showID) => {
  const [rows] = await pool.query(
    'SELECT * FROM pictures WHERE show_id = ?',
    [showID]
  );
  return rows;
};

const addPicture = async ({ show_id, image_url }) => {
  const [result] = await pool.query(
    'INSERT INTO pictures (show_id, image_url) VALUES (?, ?)',
    [show_id, image_url]
  );
  return result.insertId;
};

const updateStreamStatus = async (schedule_id, is_streaming) => {
  const [result] = await pool.query(
    'UPDATE schedules SET is_streaming = ? WHERE schedule_id = ?',
    [is_streaming, schedule_id]
  );
  return result;
};

// ✅ Export all functions
module.exports = {
  loginUser,
  registerUser,
  getShows,
  getShowById,
  getShowsByIDs,
  getShowSchedules,
  createShow,
  createSchedule,
  updateShow,
  deleteShow,
  updateSchedule,
  deleteSchedule,
  createBooking,
  getPicturesByShowId,
  getUserById,
  updateUserById,
  getScheduleById,
  createBooking,
  getBookingsByUserId,
  deleteBooking,  
  getStreamingSchedules,
  getPictures,
  addPicture,
  updateStreamStatus
};