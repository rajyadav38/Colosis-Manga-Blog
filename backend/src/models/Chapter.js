const mongoose = require("mongoose");

const chapterSchema = new mongoose.Schema(
  {
    storyId: {
      type: String,
      required: true,
    },

    chapterNumber: {
      type: Number,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    // For novels
    content: {
      type: String,
      default: "",
    },

    // For manga/comics
    pages: [
      {
        pageNumber: {
          type: Number,
          required: true,
        },

        imageUrl: {
          type: String,
          default: "",
        },

        elements: [
          {
            id: String, // unique id for React rendering

            type: {
              type: String,
              enum: ["bubble", "text"],
            },

            text: String,

            x: Number,
            y: Number,

            width: Number,
            height: Number,

            rotation: Number,

            fontSize: Number,

            color: {
              type: String,
              default: "#000000",
            },

            fontFamily: {
              type: String,
              default: "Arial",
            },

            zIndex: {
              type: Number,
              default: 1,
            },
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Chapter", chapterSchema);
