const db = require('./db');

const resetData = async () => {
  try {
    const promiseQuery = (sql, args) => new Promise((resolve, reject) => {
      db.query(sql, args, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });

    console.log("Membaca data barang yang ada...");
    const existingProducts = await promiseQuery('SELECT id_produk FROM produk ORDER BY id_produk ASC');
    
    console.log("Menyiapkan data PC Master Race baru...");
    const newProducts = [
      ['VGA NVIDIA RTX 4090 24GB ROG Strix', 38500000, 3, 1],
      ['Prosesor Intel Core i9-14900K', 10500000, 12, 1],
      ['Prosesor AMD Ryzen 9 7950X3D', 11200000, 8, 1],
      ['Motherboard ASUS ROG Maximus Z790', 8500000, 10, 1],
      ['RAM Corsair Dominator Titanium 64GB DDR5', 4500000, 15, 1],
      ['SSD Samsung 990 PRO 2TB PCIe 4.0 NVMe', 3100000, 30, 1],
      ['Power Supply Seasonic Vertex 1000W 80+ Gold', 2800000, 15, 1],
      ['Casing Lian Li O11 Dynamic EVO', 2700000, 8, 1],
      ['Monitor ASUS ROG Swift OLED 27" 240Hz', 15500000, 5, 1],
      ['Keyboard Mechanical Keychron Q1 Pro', 3100000, 20, 1],
      ['Mouse Wireless Logitech G Pro X Superlight 2', 2400000, 18, 1],
      ['Headset Gaming SteelSeries Arctis Nova Pro', 5500000, 10, 1],
      ['Thermal Paste Thermal Grizzly Kryonaut 1g', 150000, 45, 1],
      ['Liquid Cooler AIO NZXT Kraken Elite 360', 4200000, 7, 1],
      ['Kursi Gaming Secretlab TITAN Evo', 8500000, 0, 1]
    ];

    for (let i = 0; i < newProducts.length; i++) {
      const p = newProducts[i];
      if (i < existingProducts.length) {
        // Update yang lama agar tidak merusak relasi tabel detail_transaksi
        const id = existingProducts[i].id_produk;
        await promiseQuery('UPDATE produk SET nama_produk = ?, harga = ?, stok = ?, id_kategori = ? WHERE id_produk = ?', [...p, id]);
      } else {
        // Tambah sisanya
        await promiseQuery('INSERT INTO produk (nama_produk, harga, stok, id_kategori) VALUES (?, ?, ?, ?)', p);
      }
    }

    console.log("✅ SUKSES! Hanya data barang yang diubah, database pelanggan dan transaksi tetap AMAN.");
    process.exit(0);
  } catch (error) {
    console.error("❌ ERROR:", error);
    process.exit(1);
  }
};

resetData();
