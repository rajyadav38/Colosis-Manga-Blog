const Message = require("../models/Message");
const Conversation = require("../models/Conversation");

const onlineUsers = new Map();

module.exports = function (io) {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // user joins
    socket.on("join", (userId) => {
      onlineUsers.set(userId, socket.id);

      console.log("Online users:", onlineUsers);
    });

    // send message
    socket.on("sendMessage", async (data) => {
      const { senderId, receiverId, text } = data;

      try {
        // find conversation
        let conversation = await Conversation.findOne({
          members: { $all: [senderId, receiverId] },
        });

        // create conversation if not exists
        if (!conversation) {
          conversation = await Conversation.create({
            members: [senderId, receiverId],
          });
        }

        // save message
        const message = await Message.create({
          conversationId: conversation._id,
          senderId,
          text,
        });

        // send to receiver
        const receiverSocket = onlineUsers.get(receiverId);

        if (receiverSocket) {
          io.to(receiverSocket).emit("receiveMessage", message);
        }
      } catch (error) {
        console.error("Message error:", error);
      }
    });

    // disconnect
    socket.on("disconnect", () => {
      for (let [userId, id] of onlineUsers) {
        if (id === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }

      console.log("User disconnected");
    });
  });
};
