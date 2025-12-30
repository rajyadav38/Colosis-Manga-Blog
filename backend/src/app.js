const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Colosis Backend is running 🚀");
});

module.exports = app;

const pool = require("./config/db");

app.get("/db-test", async (req, res) => {
  try {
    await pool.getConnection();
    res.json({ status: "MySQL connected successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
