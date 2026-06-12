const mongoose = require("mongoose");

const chapterSchema = new mongoose.Schema(
  {
    storyId: String,

    chapterNumber: Number,

    title: String,

    content: String,

    pages: [
      {
        image: String,
        text: String,
      },
    ],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Chapter", chapterSchema);
