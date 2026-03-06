require("dotenv").config();
const http = require("http");
const app = require("./app");
const { Server } = require("socket.io");

const connectMongoDB = require("./config/mongo");

connectMongoDB();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

require("./socket/socket")(io);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
