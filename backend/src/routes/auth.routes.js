const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

router.post("/google", async (req, res) => {
  const { firebaseUid, username, email, avatar } = req.body;

  try {
    // Find by email
    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: "Server Error",
          });
        }

        let user;

        // Existing user
        if (result.length > 0) {
          user = result[0];

          // Save firebase uid if missing
          if (!user.firebase_uid) {
            db.query(
              `UPDATE users
               SET firebase_uid = ?,
                   avatar = ?
               WHERE id = ?`,
              [firebaseUid, avatar, user.id],
            );
          }
        } else {
          // Create new user
          const insert = await new Promise((resolve, reject) => {
            db.query(
              `INSERT INTO users
                  (username,
                   email,
                   firebase_uid,
                   avatar)
                  VALUES (?, ?, ?, ?)`,
              [username, email, firebaseUid, avatar],
              (err, result) => {
                if (err) reject(err);
                else resolve(result);
              },
            );
          });

          user = {
            id: insert.insertId,
            username,
            email,
            avatar,
          };
        }

        const token = jwt.sign(
          {
            id: user.id,
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
      },
    );
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
