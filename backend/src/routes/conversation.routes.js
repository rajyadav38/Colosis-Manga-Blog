const express = require("express");
const router = express.Router();

const conversationController = require("../controllers/conversation.controller");

router.post("/conversation", conversationController.createConversation);

router.get(
  "/conversation/:userId",
  conversationController.getUserConversations,
);

module.exports = router;
