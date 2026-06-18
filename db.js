const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD, 
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 4000,
  connectTimeout: 30000, // 
  ssl: {
    rejectUnauthorized: false, 
    minVersion: 'TLSv1.2'
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test koneksi pool
db.getConnection((err, connection) => {
  if (err) {
    console.error('KONEKSI GAGAL:', err.message);
  } else {
    console.log('BERHASIL TERHUBUNG KE TIDB CLOUD! (Menggunakan Pool)');
    connection.release();
  }
});

module.exports = db;