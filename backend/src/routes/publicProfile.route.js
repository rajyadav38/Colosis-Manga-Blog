const express = require("express");
const router = express.Router();
const db = require("../config/db");

// get public profile by username
router.get("/profile/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const [users] = await db.query(
      "SELECT id, username, bio, avatar FROM users WHERE username = ?",
      [username],
    );

    if (users.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(users[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

module.exports = router;
