const express = require("express");
const path = require("path");
const cors = require('cors');
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());
app.use(cors());

const dbPath = path.join(__dirname, "customer.db");
let db = null;

const initialization = async (response, error) => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server is running on http://localhost:3000");
    });
  } catch (error) {
    console.log(`DB ERROR: ${error.message}`);
  }
};
initialization();

app.get('/', async (req, res) => {
  const query = `
  SELECT * FROM customers;`;
  const response = await db.all(query);
  res.send(response);
});

// Search functionality
app.get('/api/search/', async (req, res) => {
  const name = req.query.name;
  const query = `SELECT * FROM customers WHERE customer_name = '${name}';`;
  const result = await db.get(query);
  res.send(result);
});

// Sort functionality
app.get('/api/sort/', async (req, res) => {
  const {sortBy} = req.query;
  if (sortBy === "date") {
    const query = `SELECT *
    FROM customers
    ORDER BY DATE(created_at);`;
    const result = await db.all(query);
    res.send(result);
  }
  else if (sortBy === "time") {
    const query = `SELECT *
    FROM customers
    ORDER BY TIME(created_at);`;
    const result = await db.all(query);
    res.send(result);
  }
  else {
    const query = `SELECT *
    FROM customers;`;
    const result = await db.all(query);
    res.send(result);
  }
});

