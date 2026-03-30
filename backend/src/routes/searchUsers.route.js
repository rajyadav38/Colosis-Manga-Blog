const express = require("express");
const router = express.Router();
const db = require("../config/db");

// live username search
router.get("/search-users/:query", async (req, res) => {
  const { query } = req.params;

  try {
    const [users] = await db.query(
      "SELECT id, username FROM users WHERE username LIKE ? LIMIT 5",
      [`%${query}%`],
    );

    res.json(users);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

module.exports = router;
