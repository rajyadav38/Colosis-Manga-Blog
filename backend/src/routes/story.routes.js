const express = require("express");
const router = express.Router();

const Story = require("../models/Story");

// CREATE STORY
router.post("/create", async (req, res) => {
  try {
    const story = await Story.create(req.body);

    res.status(201).json(story);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create story",
    });
  }
});

// GET ALL STORIES
router.get("/", async (req, res) => {
  try {
    const stories = await Story.find().sort({
      createdAt: -1,
    });

    res.json(stories);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch stories",
    });
  }
});

// GET ONE STORY
router.get("/:id", async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({
        message: "Story not found",
      });
    }

    res.json(story);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

module.exports = router;
