const mongoose = require("mongoose");

const storySchema = new mongoose.Schema(
  {
    authorId: Number,

    authorUsername: String,

    title: String,

    description: String,

    coverImage: String,

    type: {
      type: String,
      enum: ["novel", "manga", "comic"],
      required: true,
    },

    genres: [String],

    likes: {
      type: Number,
      default: 0,
    },

    bookmarks: {
      type: Number,
      default: 0,
    },

    views: {
      type: Number,
      default: 0,
    },
    generatedBookHtml: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      default: "draft",
    },

    isPublished: {
      type: Boolean,
      default: false,
    },

    publishedAt: {
      type: Date,
      default: null,
    },

    viewedBy: {
      type: [Number],
      default: [],
    },

    likedBy: {
      type: [Number],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Story", storySchema);
