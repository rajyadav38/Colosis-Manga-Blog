const express = require("express");
const router = express.Router();
const db = require("../config/db"); // your mysql connection

router.get("/users", async (req, res) => {
  try {
    const [users] = await db.query("SELECT id, username FROM users");

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
