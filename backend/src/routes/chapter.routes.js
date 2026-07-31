const express = require("express");
const router = express.Router();
const Story = require("../models/Story");
const model = require("../config/gemini");
const Chapter = require("../models/Chapter");
const mongoose = require("mongoose");
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

router.put("/:chapterId/page/:pageNumber", async (req, res) => {
  try {
    const { chapterId, pageNumber } = req.params;
    const { elements } = req.body;

    const chapter = await Chapter.findById(chapterId);

    if (!chapter) {
      return res.status(404).json({
        message: "Chapter not found",
      });
    }

    const page = chapter.pages.find((p) => p.pageNumber === Number(pageNumber));

    if (!page) {
      return res.status(404).json({
        message: "Page not found",
      });
    }

    page.elements = elements;

    await chapter.save();

    res.json({
      message: "Page saved successfully",
      page,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

router.put("/:chapterId/page/:pageNumber/elements", async (req, res) => {
  try {
    const { chapterId, pageNumber } = req.params;
    const { elements } = req.body;

    const chapter = await Chapter.findById(chapterId);

    if (!chapter) {
      return res.status(404).json({
        message: "Chapter not found",
      });
    }

    const page = chapter.pages.find((p) => p.pageNumber === Number(pageNumber));

    if (!page) {
      return res.status(404).json({
        message: "Page not found",
      });
    }

    page.elements = elements;

    await chapter.save();

    res.json({
      message: "Page saved successfully",
      page,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

router.put("/:id/add-page", async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id);

    if (!chapter) {
      return res.status(404).json({
        message: "Chapter not found",
      });
    }

    chapter.pages.push({
      id: new mongoose.Types.ObjectId().toString(),

      name: `Page ${chapter.pages.length + 1}`,

      pageNumber: chapter.pages.length + 1,

      imageUrl: req.body.imageUrl || "",

      elements: [],
    });

    await chapter.save();

    res.json(chapter);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to add page",
    });
  }
});

router.put("/:chapterId/page/:pageId/rename", async (req, res) => {
  try {
    const { chapterId, pageId } = req.params;
    const { name } = req.body;

    const chapter = await Chapter.findById(chapterId);

    if (!chapter) {
      return res.status(404).json({
        message: "Chapter not found",
      });
    }

    const page = chapter.pages.find((p) => p.id === pageId);

    if (!page) {
      return res.status(404).json({
        message: "Page not found",
      });
    }

    page.name = name;

    await chapter.save();

    res.json(page);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

router.delete("/:chapterId/page/:pageId", async (req, res) => {
  try {
    const { chapterId, pageId } = req.params;

    const chapter = await Chapter.findById(chapterId);

    if (!chapter) {
      return res.status(404).json({
        message: "Chapter not found",
      });
    }

    chapter.pages = chapter.pages.filter((p) => p.id !== pageId);

    chapter.pages.forEach((page, index) => {
      page.pageNumber = index + 1;
    });

    await chapter.save();

    res.json(chapter);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

router.post("/:chapterId/page/:pageId/duplicate", async (req, res) => {
  try {
    const { chapterId, pageId } = req.params;

    const chapter = await Chapter.findById(chapterId);

    if (!chapter) {
      return res.status(404).json({
        message: "Chapter not found",
      });
    }

    const page = chapter.pages.find((p) => p.id === pageId);

    if (!page) {
      return res.status(404).json({
        message: "Page not found",
      });
    }

    const copy = {
      ...page.toObject(),
      id: new mongoose.Types.ObjectId().toString(),
      name: `${page.name} Copy`,
    };

    const index = chapter.pages.findIndex((p) => p.id === pageId);

    chapter.pages.splice(index + 1, 0, copy);

    chapter.pages.forEach((page, index) => {
      page.pageNumber = index + 1;
    });

    await chapter.save();

    res.json(chapter);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

router.get("/details/:id", async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id);

    if (!chapter) {
      return res.status(404).json({
        message: "Chapter not found",
      });
    }

    res.json(chapter);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
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
