const express = require("express");
const router = express.Router();
const db = require("../config/db"); // your mysql connection

router.get("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [users] = await db.query(
      `
      SELECT
        id,
        username,
        bio,
        avatar
      FROM users
      WHERE id != ?
      `,
      [id],
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
