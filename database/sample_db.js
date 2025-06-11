const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');


const pool = mysql.createPool({
  host: 'localhost',      // DB Host 
  user: 'root',           // DB User
  password: 'Newysk1234',    // DB Password
  database: 'theaterDB',  // Name for Datebase
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

function getShows() {
    return (    
    [
        {
        Show_ID: 1,
        Title: "Orign",
        Description: "Stroy of a man who is a hero",
        Category: "Opera",
        Price: 1000
        },
        {
        Show_ID: 2,
        Title: "haha hoho",
        Description: "The girl who is a hero",
        Category: "Comedy",
        Price: 2000
        }
    ]
)
}

async function getShowById(showID) {
  const [rows] = await pool.query('SELECT * FROM shows WHERE show_id = ?', [showID]);
  if (rows.length === 0) return null;
  return rows[0];
}

function getShowSchedules(showID) {
    return (
        {
            Schedule_ID: 1,
            Admin_ID: 1,
            Date: "2025-06-06",
            Location: "New York",
            Show_ID: 1
        }
    )
}

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

  // 3) Success Login;
  const token = jwt.sign(
    { id: user.user_id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
  return { token, user: { id: user.user_id, email: user.email, name: user.name } };
};

// ✅ Create a new show
const createShow = async ({ title, description, category, price }) => {
  return {
    Show_ID: Math.floor(Math.random() * 10000),
    Title: title,
    Description: description,
    Category: category,
    Price: price
  };
};

// Sample shows data
let shows = [
  {
    show_id: 1,
    title: "Virtual Show",
    description: "This is a virtual show.",
    category: "Muscial>",
    price: 10000,
    theater_id: 10 // The user Id of the admin who createed the show
  }
];

// ✅ Create a new schedule
const createSchedule = async ({ show_id, admin_id, date, location }) => {
  return {
    Schedule_ID: Math.floor(Math.random() * 10000),
    Show_Show_ID: show_id,
    Admin_ID: admin_id,
    Date: date,
    Location: location
  };
};

//  ✅ Update a show)
const updateShow = async ({ showId, title, description, category, price }) => {
  const show = shows.find(s => s.show_id === Number(showId));
  if (!show) return null;
  if (title) show.title = title;
  if (description) show.description = description;
  if (category) show.category = category;
  if (price) show.price = price;
  return show;
};

// ✅ Delete a show 
const deleteShow = async (showId) => {
  return true; // For now it's assumed that the show has been deleted.(have to modify!)
};



// ✅ Update a schedule
const updateSchedule = async ({ scheduleId, show_id, admin_id, date, location }) => {
  return {
    Schedule_ID: Number(scheduleId),
    Show_Show_ID: show_id,
    Admin_ID: admin_id,
    Date: date,
    Location: location
  };
};

// ✅ Delete a schedule
const deleteSchedule = async (scheduleId) => {
  return true;
};

// ✅ Sample booking data
let bookings = [
  { Booking_ID: 1, Date: "2024-06-01", User_ID: 1, Show_ID: 1 },
  { Booking_ID: 2, Date: "2024-06-02", User_ID: 2, Show_ID: 2 }
];

// ✅ Get all bookings 
function getBookings() {
  return bookings;
}

// ✅ Create a new booking 
function createBooking({ Date, User_ID, Show_ID }) {
  const newBooking = {
    Booking_ID: bookings.length ? bookings[bookings.length - 1].Booking_ID + 1 : 1,
    Date,
    User_ID,
    Show_ID
  };
  bookings.push(newBooking);
  return newBooking;
}

// ✅ Delete booking
function deleteBooking(Booking_ID) {
  const idx = bookings.findIndex(b => b.Booking_ID === Number(Booking_ID));
  if (idx === -1) return false;
  bookings.splice(idx, 1);
  return true;
}

// 샘플 users 데이터
let users = [
  { user_id: 10, name: "회원", email: "회원가입한_이메일", password: "비밀번호", type: 'USER', registration_date: '2024-06-10' },

];

function getUserById(userId) {
  return users.find(u => u.user_id === Number(userId));
}

function updateUserById(userId, { name, email, password }) {
  const user = users.find(u => u.user_id === Number(userId));
  if (!user) return null;
  if (name) user.name = name;
  if (email) user.email = email;
  if (password) user.password = password;
  return user;
}

module.exports = { 
  loginUser, 
  registerUser, 
  getShows, 
  getShowById, 
  getShowSchedules,
  createShow,
  createSchedule,
  updateShow,
  deleteShow,
  updateSchedule,
  deleteSchedule,
  getBookings,
  createBooking,
  deleteBooking,
  getUserById,
  updateUserById
};
