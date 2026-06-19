const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Update profile
router.put("/update-profile", async (req, res) => {
  const { id, username, bio, avatar } = req.body;

  try {
    await db.query(
      "UPDATE users SET username = ?, bio = ?, avatar = ? WHERE id = ?",
      [username, bio, avatar, id],
    );

    res.json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = router;
