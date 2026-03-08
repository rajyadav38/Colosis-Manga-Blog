const express = require("express");
const cors = require("cors");
const app = express();

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const conversationRoutes = require("./routes/conversation.routes");
const messageRoutes = require("./routes/message.routes");
const updateUserRoutes = require("./routes/updateUser.route");
/* 🔴 BODY PARSER — THIS FIXES YOUR ERROR */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.post("/test", (req, res) => {
  res.json(req.body);
});
app.use(cors());
app.use(express.json());
/* Routes */
app.use("/api/users", updateUserRoutes);
app.use("/api/chat", messageRoutes);
app.use("/api/chat", conversationRoutes);
app.use("/api", userRoutes);
app.use("/api/auth", authRoutes);
app.get("/", (req, res) => {
  res.send("Colosis Backend is running 🚀");
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
