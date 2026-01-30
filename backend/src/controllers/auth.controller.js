const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  console.log("Signup body:", req.body);

  // 🛡️ SAFETY CHECK (no destructuring)
  if (!req.body || typeof req.body !== "object") {
    return res.status(400).json({ message: "Invalid request body" });
  }

  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required",
    });
  }

  try {
    // Check if user exists
    const [existing] = await pool.query(
      "SELECT id FROM users WHERE username = ?",
      [username],
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashedPassword],
    );

    return res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Signup failed" });
  }
};

exports.login = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ message: "Invalid request" });
  }

  const username = req.body.username;
  const password = req.body.password;

  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE username = ?", [
      username,
    ]);

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
};
