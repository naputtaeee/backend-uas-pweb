const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { Redis } = require('@upstash/redis');
require('dotenv').config();

const db = require('./db');
const verifyToken = require('./authMiddleware');

const app = express();
app.use(express.json());
app.use(cors());

// Inisialisasi Redis
const redis = new Redis({
  url: process.env.REDIS_URL,
  token: process.env.REDIS_TOKEN,
});

// Route Login
app.post('/login', async (req, res) => {
    // Simulasi User (Nanti bisa diganti pengecekan ke tabel user di MySQL)
    const userId = "nabila123"; 
    
    // 1. Buat token
    const token = jwt.sign({ id: userId }, "SECRET_KEY_MU", { expiresIn: '1h' });

    // 2. Simpan di Redis
    await redis.set(userId, token);

    res.json({ message: "Login berhasil!", token: token });
});

// Route Produk (Dilindungi oleh satpam/verifyToken)
app.get('/produk', verifyToken, (req, res) => {
    db.query('SELECT * FROM produk', (err, results) => {
        if(err) return res.status(500).send(err);
        res.json(results);
    });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});