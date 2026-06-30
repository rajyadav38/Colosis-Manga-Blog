const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const [existing] = await db.query(
      `
      SELECT *
      FROM users
      WHERE email = ?
      `,
      [email],
    );

    if (existing.length > 0) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      `
      INSERT INTO users
      (
        username,
        email,
        password,
        is_verified
      )
      VALUES (?, ?, ?, false)
      `,
      [username, email, hashedPassword],
    );

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await db.query(
      `
      INSERT INTO email_verifications
      (
        email,
        otp,
        expires_at
      )
      VALUES (?, ?, ?)
      `,
      [email, otp, expiresAt],
    );

    await sendVerificationEmail(email, otp);

    return res.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Signup failed",
    });
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
    if (!user.is_verified) {
      return res.status(403).json({
        message: "Please verify your email first.",
      });
    }
    const match = await bcrypt.compare(password, user.password);

    if (!user.password) {
      return res.status(400).json({
        message:
          "This account uses Google Sign In. Please continue with Google.",
      });
    }

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
