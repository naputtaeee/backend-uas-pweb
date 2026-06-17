const mysql = require('mysql2');
require('dotenv').config();

// Menggunakan createPool alih-alih createConnection agar koneksi 
// tidak terputus otomatis oleh TiDB Cloud (idle timeout).
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD, 
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false
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
    connection.release(); // Kembalikan koneksi ke pool
  }
});

module.exports = db;