require("dotenv").config();
const app = require("./app");

// MongoDB
const connectMongoDB = require("./config/mongo");
const PORT = process.env.PORT || 5000;

// Connect MongoDB FIRST
connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
