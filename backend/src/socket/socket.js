const Message = require("../models/Message");
const Conversation = require("../models/Conversation");

const onlineUsers = new Map();

module.exports = function (io) {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // user joins
    socket.on("join", (userId) => {
      onlineUsers.set(String(userId), socket.id);

      console.log("Online users:");
      console.log(onlineUsers);
    });

    // send message
    socket.on("sendMessage", async (data) => {
      const sender = String(data.senderId);
      const receiver = String(data.receiverId);
      const text = data.text;

      try {
        // find conversation
        let conversation = await Conversation.findOne({
          members: { $all: [sender, receiver] },
        });

        // create conversation if not exists
        if (!conversation) {
          conversation = await Conversation.create({
            members: [sender, receiver],
          });
        }

        // save message
        const message = await Message.create({
          conversationId: conversation._id,
          senderId: sender,
          text,
        });

        message.receiverId = receiver;

        // send to receiver
        const receiverSocket = onlineUsers.get(receiver);

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
