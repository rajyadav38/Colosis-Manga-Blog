const mongoose = require("mongoose");

const reelSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true,
  },

  username: {
    type: String,
    required: true,
  },

  caption: {
    type: String,
    default: "",
  },

  videoUrl: {
    type: String,
    required: true,
  },

  thumbnailUrl: {
    type: String,
    default: "",
  },

  likes: {
    type: [Number],
    default: [],
  },

  commentsCount: {
    type: Number,
    default: 0,
  },

  views: {
    type: Number,
    default: 0,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Reel", reelSchema);
