require("dotenv").config();
const app = require("./app");
<<<<<<< HEAD

// 🔹 MongoDB
const connectMongoDB = require("./config/mongo");
const PORT = process.env.PORT || 5000;

// Connect MongoDB FIRST
connectMongoDB();

=======
const PORT = process.env.PORT || 5000;

>>>>>>> f10666a6706c0f42b76b8af4a7e6d2ea3fb63dd5
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
