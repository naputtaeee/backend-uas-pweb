const express = require('express');
const cors = require('cors');
const connection = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

// --- ROUTES UNTUK AUTH ---
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  const sql = 'SELECT * FROM users WHERE username = ?';
  connection.query(sql, [username], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (results.length === 0) return res.status(401).json({ error: 'User tidak ditemukan' });

    const user = results[0];

    // Cek password langsung dari database (Note: disarankan menggunakan bcrypt di produksi)
    if (password !== user.password) {
      return res.status(401).json({ error: 'Password salah' });
    }

    const token = 'fake-token-123'; // Token sederhana untuk testing awal
    res.json({ message: 'Login berhasil', token });
  });
});

app.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Data tidak lengkap' });

  const checkSql = 'SELECT * FROM users WHERE username = ?';
  connection.query(checkSql, [username], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (results.length > 0) return res.status(400).json({ error: 'Username sudah digunakan' });

    const insertSql = 'INSERT INTO users (username, password, token) VALUES (?, ?, ?)';
    const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
    
    connection.query(insertSql, [username, password, token], (err, results) => {
      if (err) return res.status(500).json({ error: 'Gagal membuat akun', detail: err.message });
      res.status(201).json({ message: 'Akun berhasil dibuat', token });
    });
  });
});

// --- ROUTES UNTUK BARANG (CRUD) ---

// 1. GET Semua Barang
app.get('/api/barang', (req, res) => {
  const sql = 'SELECT * FROM produk';
  connection.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error', detail: err.message });
    res.json(results);
  });
});

// 2. POST Tambah Barang
app.post('/api/barang', (req, res) => {
  const { nama_produk, harga, stok } = req.body;
  const sql = 'INSERT INTO produk (nama_produk, harga, stok) VALUES (?, ?, ?)';
  
  connection.query(sql, [nama_produk, harga, stok], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error', detail: err.message });
    
    // Kembalikan ID produk yang baru saja dibuat
    res.status(201).json({ 
      message: 'Barang berhasil ditambahkan', 
      id_produk: results.insertId 
    });
  });
});

// 3. PUT Edit/Update Barang
app.put('/api/barang/:id', (req, res) => {
  const { id } = req.params;
  const { nama_produk, harga, stok } = req.body;
  const sql = 'UPDATE produk SET nama_produk = ?, harga = ?, stok = ? WHERE id_produk = ?';
  
  connection.query(sql, [nama_produk, harga, stok, id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error', detail: err.message });
    
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Barang tidak ditemukan' });
    }
    res.json({ message: 'Barang berhasil diupdate' });
  });
});

// 4. DELETE Hapus Barang
app.delete('/api/barang/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM produk WHERE id_produk = ?';
  
  connection.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error', detail: err.message });
    
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Barang tidak ditemukan' });
    }
    res.json({ message: 'Barang berhasil dihapus' });
  });
});

// --- JALANKAN SERVER ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server Backend berjalan di http://localhost:${PORT}`);
});