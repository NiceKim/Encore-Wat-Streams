// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const mysql = require('mysql2/promise');


// const pool = mysql.createPool({
//   host: 'localhost',      // DB Host 
//   user: 'root',           // DB User
//   password: process.env.DB_PASSWORD,  // DB Password
//   database: 'encore_wat_streams_database',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });

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

// async function getShowById(showID) {
//   const [rows] = await pool.query('SELECT * FROM shows WHERE show_id = ?', [showID]);
//   if (rows.length === 0) return null;
//   return rows[0];
// }

const shows = [
  {
    show_id: 1,
    admin_id: 2,
    title: "Hamlet Reimagined",
    description: "A modern reinterpretation of Shakespeare's Hamlet, exploring contemporary social issues.",
    category: "Drama",
    price: 25.00,
    thumbnail: "https://example.com/images/hamlet.jpg"
  },
  {
    show_id: 2,
    admin_id: 2,
    title: "Stand-Up Saturday",
    description: "A night full of laughs with local stand-up comedians performing live.",
    category: "Comedy",
    price: 15.00,
    thumbnail: "https://example.com/images/standup.jpg"
  },
  {
    show_id: 3,
    admin_id: 3,
    title: "Children’s Puppet Show",
    description: "An engaging puppet show designed for children aged 3-10, teaching valuable life lessons.",
    category: "Kids",
    price: 10.00,
    thumbnail: "https://example.com/images/puppetshow.jpg"
  }
];

async function getShowById(showID) {
  return (
    {
      show_id: 1,
      admin_id: 2,
      title: "Hamlet Reimagined",
      description: "A modern reinterpretation of Shakespeare's Hamlet, exploring contemporary social issues.",
      category: "Drama",
      price: 25.00,
      thumbnail: "p1.jpg" 
    }
  )
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
// const registerUser = async ({ email, name, password }) => {
//   const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
//   if (rows.length > 0) {
//     throw new Error('Email already exists.');
//   }

//   const salt = await bcrypt.genSalt(10);
//   const hashedPassword = await bcrypt.hash(password, salt);
//   await pool.query(
//     'INSERT INTO users (email, name, password, type, registration_date) VALUES (?, ?, ?, ?, NOW())',
//     [email, name, hashedPassword, 'USER']
//   );
// };
let users = [
  { user_id: 1, name: "Alice Viewer", email: "viewer1@example.com", password: "hashed_pw1", type: "USER", registration_date: "2025-06-10" },
  { user_id: 2, name: "Theater Group A", email: "theater1@example.com", password: "hashed_pw2", type: "ADMIN", registration_date: "2025-06-10" },
  { user_id: 3, name: "Theater Group B", email: "theater2@example.com", password: "hashed_pw3", type: "ADMIN", registration_date: "2025-06-10" },
  { user_id: 4, name: "Bob Viewer", email: "viewer2@example.com", password: "hashed_pw4", type: "USER", registration_date: "2025-06-10" },
  { user_id: 5, name: "Carol Viewer", email: "viewer3@example.com", password: "hashed_pw5", type: "USER", registration_date: "2025-06-10" },
];


const registerUser = ({ email, name, password }) => {
  const existing = users.find(user => user.email === email);
  if (existing) {
    throw new Error('Email already exists.');
  }

  const newUser = {
    user_id: users.length + 1,
    name,
    email,
    password,
    type: 'USER',
    registration_date: new Date().toISOString().slice(0, 10),
  };

  users.push(newUser);
  return newUser;
};

// // ✅ User Login
// const loginUser = async ({ email, password }) => {
//   // 1) Find User by email 
//   const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
//   if (rows.length === 0) {
//     throw new Error('Email does not exists.');
//   }

//   const user = rows[0];
//   // 2) Verify Password 
//   const isMatch = await bcrypt.compare(password, user.password);
//   if (!isMatch) {
//     throw new Error('Password is incorrect');
//   }

//   // 3) Success Login;
//   const token = jwt.sign(
//     { id: user.user_id, email: user.email, name: user.name },
//     process.env.JWT_SECRET,
//     { expiresIn: '24h' }
//   );
//   return { token, user: { id: user.user_id, email: user.email, name: user.name } };
// };
const loginUser = ({ email, password }) => {
  const user = users.find(u => u.email === email);
  if (!user) {
    throw new Error('Email does not exist.');
  }

  if (user.password !== password) {
    throw new Error('Password is incorrect.');
  }

  const fakeToken = 'mocked-jwt-token';

  return {
    token: fakeToken,
    user: {
      id: user.user_id,
      email: user.email,
      name: user.name
    }
  };
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
