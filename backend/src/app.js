const express = require("express");
const cors = require("cors");
const app = express();

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const conversationRoutes = require("./routes/conversation.routes");
const messageRoutes = require("./routes/message.routes");
const updateUserRoutes = require("./routes/updateUser.route");
const publicProfileRoutes = require("./routes/publicProfile.route");
const searchUsersRoutes = require("./routes/searchUsers.route");
/* 🔴 BODY PARSER — THIS FIXES YOUR ERROR */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.post("/test", (req, res) => {
  res.json(req.body);
});
app.use(cors());
app.use(express.json());
/* Routes */
app.use("/api/users", searchUsersRoutes);
app.use("/api/users", publicProfileRoutes);
app.use("/api/users", updateUserRoutes);
app.use("/api/chat", messageRoutes);
app.use("/api/chat", conversationRoutes);
app.use("/api", userRoutes);
app.use("/api/auth", authRoutes);
app.get("/", (req, res) => {
  res.send("Colosis Backend is running 🚀");
});
app.get("/api/profile/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      "SELECT username, bio FROM users WHERE id = ?",
      [id],
    );

    if (!rows.length) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Profile route error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});
app.post("/api/follow", async (req, res) => {
  try {
    const { followerId, followingId } = req.body;

    if (followerId === followingId) {
      return res.status(400).json({
        message: "You cannot follow yourself",
      });
    }

    await pool.query(
      "INSERT INTO follows (follower_id, following_id) VALUES (?, ?)",
      [followerId, followingId],
    );

    res.json({ message: "Followed successfully" });
  } catch (error) {
    console.error("Follow error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});
app.delete("/api/unfollow", async (req, res) => {
  try {
    const { followerId, followingId } = req.body;

    await pool.query(
      "DELETE FROM follows WHERE follower_id = ? AND following_id = ?",
      [followerId, followingId],
    );

    res.json({ message: "Unfollowed successfully" });
  } catch (error) {
    console.error("Unfollow error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});
app.get("/api/follow-stats/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [followersRows] = await pool.query(
      "SELECT COUNT(*) AS count FROM follows WHERE following_id = ?",
      [id],
    );

    const [followingRows] = await pool.query(
      "SELECT COUNT(*) AS count FROM follows WHERE follower_id = ?",
      [id],
    );

    res.json({
      followers: followersRows[0].count,
      following: followingRows[0].count,
    });
  } catch (error) {
    console.error("Follow stats error:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
});
app.get("/api/is-following/:followerId/:followingId", async (req, res) => {
  try {
    const { followerId, followingId } = req.params;

    const [rows] = await pool.query(
      "SELECT * FROM follows WHERE follower_id = ? AND following_id = ?",
      [followerId, followingId],
    );

    res.json({
      isFollowing: rows.length > 0,
    });
  } catch (error) {
    console.error("Follow check error:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
});
const pool = require("./config/db");
app.get("/db-test", async (req, res) => {
  try {
    await pool.getConnection();
    res.json({ status: "MySQL connected successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.use(
  cors({
    origin: "http://localhost:3000", // React app
  }),
);

module.exports = app;
