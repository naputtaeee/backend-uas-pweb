const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD, // Kita pakai DB_PASSWORD agar sama dengan di Render
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false
  }
});

db.connect((err) => {
  if (err) {
    console.error('KONEKSI GAGAL:', err.message);
  } else {
    console.log('BERHASIL TERHUBUNG KE TIDB CLOUD!');
  }
});

module.exports = db;