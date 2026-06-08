const express = require('express');
const mysql   = require('mysql2/promise');
const cors    = require('cors');
require('dotenv').config();

const app = express();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Database connection pool ──────────────────────────────────────────────────
const pool = mysql.createPool({
  host:     process.env.DB_HOST,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit:    10,
});

// Test DB connection on startup
pool.getConnection()
  .then(conn => {
    console.log('✅ MySQL connected successfully');
    conn.release();
  })
  .catch(err => {
    console.error('❌ MySQL connection failed:', err.message);
    process.exit(1);
  });

// ── Routes ────────────────────────────────────────────────────────────────────

// GET all available artworks
app.get('/api/artworks', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM artworks WHERE available = 1 ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch artworks' });
  }
});

// GET single artwork by ID
app.get('/api/artworks/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM artworks WHERE id = ?',
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Artwork not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch artwork' });
  }
});

// POST create a new order
app.post('/api/orders', async (req, res) => {
  const { buyer_name, buyer_email, items } = req.body;

  if (!buyer_name || !buyer_email || !items || !items.length) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    let total = 0;
    const orderIds = [];

    for (const item of items) {
      const [[art]] = await conn.query(
        'SELECT price, available FROM artworks WHERE id = ?',
        [item.artwork_id]
      );
      if (!art || !art.available) {
        throw new Error(`Artwork ${item.artwork_id} is not available`);
      }
      const itemTotal = art.price * item.quantity;
      total += itemTotal;

      const [result] = await conn.query(
        `INSERT INTO orders
           (buyer_name, buyer_email, artwork_id, quantity, total_price)
         VALUES (?, ?, ?, ?, ?)`,
        [buyer_name, buyer_email, item.artwork_id, item.quantity, itemTotal]
      );
      orderIds.push(result.insertId);
    }

    await conn.commit();
    res.json({ success: true, order_ids: orderIds, total });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ error: err.message || 'Order failed' });
  } finally {
    conn.release();
  }
});

// GET all orders (simple admin view)
app.get('/api/orders', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT o.*, a.title, a.artist, a.image_url
      FROM orders o
      JOIN artworks a ON o.artwork_id = a.id
      ORDER BY o.placed_at DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// ── Start server ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Art Gallery API running at http://localhost:${PORT}`);
});
