const express = require("express");
const router = express.Router();
const Story = require("../models/Story");
const model = require("../config/gemini");
const Chapter = require("../models/Chapter");

const cloudinary = require("../config/cloudinary");

router.post("/create", async (req, res) => {
  try {
    const chapter = await Chapter.create(req.body);

    res.status(201).json(chapter);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create chapter",
    });
  }
});

// GET STORY CHAPTERS
router.get("/:storyId", async (req, res) => {
  try {
    const chapters = await Chapter.find({
      storyId: req.params.storyId,
    }).sort({
      chapterNumber: 1,
    });

    res.json(chapters);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch chapters",
    });
  }
});
router.put("/:id", async (req, res) => {
  console.log("UPDATE ROUTE HIT");
  console.log(req.params.id);
  console.log(req.body);

  try {
    const { title, content } = req.body;

    const chapter = await Chapter.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true },
    );

    res.json(chapter);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.delete("/:id", async (req, res) => {
  console.log("DELETE ROUTE HIT");
  console.log(req.params.id);

  try {
    await Chapter.findByIdAndDelete(req.params.id);

    res.json({
      message: "Chapter deleted",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
