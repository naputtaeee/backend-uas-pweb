const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // Ngambil token dari header yang dikirim Postman/Frontend
    const token = req.headers['authorization'];

    if (!token) return res.status(403).json({ message: "Token diperlukan!" });

    // Verifikasi apakah tokennya asli atau palsu
    jwt.verify(token, "SECRET_KEY_MU", (err, decoded) => {
        if (err) return res.status(401).json({ message: "Token tidak valid!" });
        
        // Kalau berhasil, lanjut ke proses berikutnya
        req.userId = decoded.id;
        next();
    });
};

module.exports = verifyToken;