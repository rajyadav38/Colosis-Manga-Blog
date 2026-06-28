const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

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

router.post("/signup", authController.signup);
router.post("/login", authController.login);

module.exports = router;
