const mongoose = require("mongoose");

const reelSchema = new mongoose.Schema(
  {
    userId: Number,

    username: String,

    caption: String,

    videoUrl: String,

    likes: {
      type: Number,
      default: 0,
    },

    likedBy: [
      {
        type: Number,
      },
    ],

    comments: [
      {
        username: String,
        text: String,
      },
    ],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Reel", reelSchema);
