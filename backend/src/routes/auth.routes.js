const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const sendOtpEmail = require("../services/email.service");
const pool = require("../config/db");
const authController = require("../controllers/auth.controller");

router.post("/google", async (req, res) => {
  try {
    const { firebaseUid, username, email, avatar } = req.body;

    // Check if user exists
    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    let user;

    // Existing user
    if (users.length > 0) {
      user = users[0];

      if (!user.firebase_uid) {
        await pool.query(
          `
          UPDATE users
          SET firebase_uid = ?,
              avatar = ?
          WHERE id = ?
          `,
          [firebaseUid, avatar, user.id],
        );

        user.firebase_uid = firebaseUid;
        user.avatar = avatar;
      }
    }

    // New user
    else {
      // Create unique username
      const finalUsername =
        username.replace(/\s+/g, "").toLowerCase() +
        Math.floor(Math.random() * 1000);

      const [result] = await pool.query(
        `
        INSERT INTO users
        (
          username,
          email,
          firebase_uid,
          avatar
        )
        VALUES (?, ?, ?, ?)
        `,
        [finalUsername, email, firebaseUid, avatar],
      );

      user = {
        id: result.insertId,
        username: finalUsername,
        email,
        firebase_uid: firebaseUid,
        avatar,
      };
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.json({
      token,
      user,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Google Login Failed",
    });
  }
});

router.post("/send-reset-otp", async (req, res) => {
  try {
    const { email } = req.body;

    const [users] = await pool.query(
      `
          SELECT *
          FROM users
          WHERE email = ?
          `,
      [email],
    );

    if (users.length === 0) {
      return res.status(404).json({
        message: "No account found with this email",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await pool.query(
      `
        INSERT INTO password_otps
        (
          email,
          otp,
          expires_at
        )
        VALUES (?, ?, ?)
        `,
      [email, otp, expiresAt],
    );

    await sendOtpEmail(email, otp);

    res.json({
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

router.post("/verify-reset-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const [rows] = await pool.query(
      `
          SELECT *
          FROM password_otps
          WHERE email = ?
          AND otp = ?
          ORDER BY created_at DESC
          LIMIT 1
          `,
      [email, otp],
    );

    if (rows.length === 0) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    const record = rows[0];

    if (new Date(record.expires_at) < new Date()) {
      return res.status(400).json({
        message: "OTP expired",
      });
    }

    res.json({
      message: "OTP verified",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { email, password } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    await pool.query(
      `
        UPDATE users
        SET password = ?
        WHERE email = ?
        `,
      [hashed, email],
    );

    await pool.query(
      `
        DELETE FROM password_otps
        WHERE email = ?
        `,
      [email],
    );

    res.json({
      message: "Password reset successful",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

router.post("/signup", authController.signup);
router.post("/login", authController.login);

module.exports = router;
