// config/db.js
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

module.exports = pool;
