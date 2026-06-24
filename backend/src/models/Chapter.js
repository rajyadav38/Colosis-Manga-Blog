const mongoose = require("mongoose");

const chapterSchema = new mongoose.Schema(
  {
    storyId: String,

    chapterNumber: Number,

    title: String,

    // For novels
    content: {
      type: String,
      default: "",
    },

    // For manga/comics
    pages: [
      {
        imageUrl: String,
        caption: {
          type: String,
          default: "",
        },

        pageNumber: Number,
      },
    ],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Chapter", chapterSchema);
