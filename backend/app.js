import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const dbPath = './data.db';
let db;

// 🔐 Token Middleware
const tokenAuthentication = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const jwtToken = authHeader?.split(' ')[1];
  if (!jwtToken) return res.status(401).send('Missing JWT Token');

  jwt.verify(jwtToken, 'MY_SECRET_TOKEN', (err, payload) => {
    if (err) return res.status(401).send('Invalid JWT Token');
    req.userId = payload.userId;
    next();
  });
};

// 🧱 Initialize DB
const initializeDBAndServer = async () => {
  try {
    db = await open({ filename: dbPath, driver: sqlite3.Database });

    await db.exec(`
      CREATE TABLE IF NOT EXISTS userdetails (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        email TEXT UNIQUE,
        password TEXT,
        gender TEXT,
        phone TEXT,
        address TEXT
      );

      CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT,
        last_name TEXT,
        phone TEXT,
        email TEXT,
        only_one_address INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS addresses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id INTEGER,
        address_line TEXT,
        city TEXT,
        state TEXT,
        pin_code TEXT,
        FOREIGN KEY(customer_id) REFERENCES customers(id)
      );
    `);

    app.listen(3001, () => {
      console.log('Server running at http://localhost:3001');
    });
  } catch (e) {
    console.log('DB Error:', e.message);
    process.exit(1);
  }
};

initializeDBAndServer();


// 👤 Register
app.post('/register', async (req, res) => {
  const { username, email, password, gender, phone, address } = req.body;
  if (!username || !email || !password || !gender || !phone || !address) {
    return res.status(400).json('All fields required');
  }
  if (password.length < 6) return res.status(400).json('Password too short');

  const existing = await db.get(`SELECT * FROM userdetails WHERE username = ? OR email = ?`, [username, email]);
  if (existing) return res.status(400).json('User already exists');

  const hashedPassword = await bcrypt.hash(password, 10);
  await db.run(
    `INSERT INTO userdetails (username, email, password, gender, phone, address)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [username, email, hashedPassword, gender, phone, address]
  );
  res.json('user registered');
});

// 🔐 Login
app.post('/login',async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body)
  const user = await db.get(`SELECT * FROM userdetails WHERE email = ?`, [email]);
  if (!user) return res.status(400).send('Invalid user');

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.status(400).send('Invalid password');

  const jwtToken = jwt.sign({ userId: user.id }, 'MY_SECRET_TOKEN');
  console.log(jwtToken)
  res.json({ jwtToken, userId: user.id });
});

// 👤 Get User Profile
app.get('/user/:id', tokenAuthentication, async (req, res) => {
  const user = await db.get(`SELECT * FROM userdetails WHERE id = ?`, [req.params.id]);
  if (!user) return res.status(404).send('User not found');
  res.json(user);
});

// 🧾 Create Customer
app.post('/customers', tokenAuthentication, async (req, res) => {
  const { first_name, last_name, phone, email, addresses } = req.body;
  if (!first_name || !last_name || !phone) {
    return res.status(400).json('Missing required fields');
  }

  const result = await db.run(
    `INSERT INTO customers (first_name, last_name, phone, email)
     VALUES (?, ?, ?, ?)`,
    [first_name, last_name, phone, email]
  );
  const customerId = result.lastID;

  if (Array.isArray(addresses)) {
    for (const addr of addresses) {
      await db.run(
        `INSERT INTO addresses (customer_id, address_line, city, state, pin_code)
         VALUES (?, ?, ?, ?, ?)`,
        [customerId, addr.address_line, addr.city, addr.state, addr.pin_code]
      );
    }
    const count = addresses.length;
    await db.run(`UPDATE customers SET only_one_address = ? WHERE id = ?`, [count === 1 ? 1 : 0, customerId]);
  }

  res.json({ message: 'Customer created', customerId });
});

// 📄 Get Customer Details
app.get('/customers/:id', tokenAuthentication, async (req, res) => {
  const customer = await db.get(`SELECT * FROM customers WHERE id = ?`, [req.params.id]);
  if (!customer) return res.status(404).json('Customer not found');

  const addresses = await db.all(`SELECT * FROM addresses WHERE customer_id = ?`, [req.params.id]);
  res.json({ ...customer, addresses });
});

// ✏️ Update Customer
app.put('/customers/:id', tokenAuthentication, async (req, res) => {
  const { first_name, last_name, phone, email, addresses } = req.body;

  await db.run(
    `UPDATE customers SET first_name=?, last_name=?, phone=?, email=? WHERE id=?`,
    [first_name, last_name, phone, email, req.params.id]
  );

  await db.run(`DELETE FROM addresses WHERE customer_id=?`, [req.params.id]);

  if (Array.isArray(addresses)) {
    for (const addr of addresses) {
      await db.run(
        `INSERT INTO addresses (customer_id, address_line, city, state, pin_code)
         VALUES (?, ?, ?, ?, ?)`,
        [req.params.id, addr.address_line, addr.city, addr.state, addr.pin_code]
      );
    }
    const count = addresses.length;
    await db.run(`UPDATE customers SET only_one_address = ? WHERE id = ?`, [count === 1 ? 1 : 0, req.params.id]);
  }

  res.json({ message: 'Customer updated' });
});

// ❌ Delete Customer
app.delete('/customers/:id', tokenAuthentication, async (req, res) => {
  await db.run(`DELETE FROM addresses WHERE customer_id=?`, [req.params.id]);
  await db.run(`DELETE FROM customers WHERE id=?`, [req.params.id]);
  res.json({ message: 'Customer deleted' });
});

// 📋 Get All Customers with Address Count
app.get('/customers', tokenAuthentication, async (req, res) => {
  const { city, state, pin_code } = req.query;
  const filters = [];
  const params = [];

  if (city) {
    filters.push('a.city = ?');
    params.push(city);
  }
  if (state) {
    filters.push('a.state = ?');
    params.push(state);
  }
  if (pin_code) {
    filters.push('a.pin_code = ?');
    params.push(pin_code);
  }

  const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

  const query = `
    SELECT c.*, COUNT(a.id) AS address_count
    FROM customers c
    LEFT JOIN addresses a ON a.customer_id = c.id
    ${whereClause}
    GROUP BY c.id
  `;

  try {
    const rows = await db.all(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching customers' });
  }
});


export default app;
