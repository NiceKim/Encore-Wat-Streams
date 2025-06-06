const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

function getShowById(showID) {
    return (
        {
            Show_ID: 1,
            Title: "Orign",
            Description: "Stroy of a man who is a hero",
            Category: "Opera",
            Price: 1000
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
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
  return { token, user: { id: user.id, email: user.email, name: user.name } };
};


module.exports = { loginUser,registerUser, getShows, getShows, getShowById,getShowSchedules};