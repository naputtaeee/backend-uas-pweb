const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // Ambil header authorization
    const authHeader = req.headers['authorization'];

    // Cek apakah ada header dan pecah kata 'Bearer' dengan tokennya
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(403).json({ message: "Token diperlukan!" });

    // Verifikasi
    jwt.verify(token, "SECRET_KEY_MU", (err, decoded) => {
        if (err) return res.status(401).json({ message: "Token tidak valid!" });
        
        req.userId = decoded.id;
        next();
    });
};

module.exports = verifyToken;