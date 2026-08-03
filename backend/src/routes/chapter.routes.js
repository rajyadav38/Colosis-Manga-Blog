const express = require("express");
const router = express.Router();
const Chapter = require("../models/Chapter");
const multer = require("multer");
const streamifier = require("streamifier");
const cloudinary = require("../config/cloudinary");
const upload = multer({
  storage: multer.memoryStorage(),
});

// ============================
// CREATE CHAPTER
// ============================

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

// ============================
// SAVE PAGE ELEMENTS
// ============================

router.put("/:chapterId/page/:pageId", async (req, res) => {
  try {
    const { chapterId, pageId } = req.params;
    const { elements } = req.body;

    const chapter = await Chapter.findById(chapterId);

    if (!chapter) {
      return res.status(404).json({
        message: "Chapter not found",
      });
    }

    const page = chapter.pages.id(pageId);

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

router.post(
  "/:chapterId/page/:pageNumber/publish",
  upload.single("image"),
  async (req, res) => {
    try {
      const { chapterId, pageNumber } = req.params;

      const chapter = await Chapter.findById(chapterId);

      if (!chapter) {
        return res.status(404).json({
          message: "Chapter not found",
        });
      }

      const page = chapter.pages.find(
        (p) => p.pageNumber === Number(pageNumber),
      );

      if (!page) {
        return res.status(404).json({
          message: "Page not found",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          message: "Image required",
        });
      }

      const uploaded = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "colosis/published-pages",
            resource_type: "image",
            public_id: `chapter-${chapterId}-page-${page.pageNumber}`,
            overwrite: true,
          },
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          },
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

      page.finalImageUrl = uploaded.secure_url;
      page.publishedAt = new Date();

      await chapter.save();

      res.json({
        success: true,
        imageUrl: uploaded.secure_url,
      });
    } catch (err) {
      console.log(err);

      res.status(500).json({
        message: "Publish failed",
      });
    }
  },
);

// ============================
// ADD PAGE
// ============================

router.put("/:id/add-page", async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id);

    if (!chapter) {
      return res.status(404).json({
        message: "Chapter not found",
      });
    }

    chapter.pages.push({
      pageNumber: chapter.pages.length + 1,
      name: `Page ${chapter.pages.length + 1}`,
      imageUrl: req.body.imageUrl,
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

// ============================
// RENAME PAGE
// ============================

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

    const page = chapter.pages.id(pageId);

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

// ============================
// DELETE PAGE
// ============================

router.delete("/:chapterId/page/:pageId", async (req, res) => {
  try {
    const { chapterId, pageId } = req.params;

    const chapter = await Chapter.findById(chapterId);

    if (!chapter) {
      return res.status(404).json({
        message: "Chapter not found",
      });
    }

    const page = chapter.pages.id(pageId);

    if (!page) {
      return res.status(404).json({
        message: "Page not found",
      });
    }

    page.deleteOne();

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

// ============================
// DUPLICATE PAGE
// ============================

router.post("/:chapterId/page/:pageId/duplicate", async (req, res) => {
  try {
    const { chapterId, pageId } = req.params;

    const chapter = await Chapter.findById(chapterId);

    if (!chapter) {
      return res.status(404).json({
        message: "Chapter not found",
      });
    }

    const page = chapter.pages.id(pageId);

    if (!page) {
      return res.status(404).json({
        message: "Page not found",
      });
    }

    const copy = page.toObject();

    delete copy._id;

    copy.pageNumber = page.pageNumber + 1;
    copy.name = `${page.name || `Page ${page.pageNumber}`} Copy`;

    const index = chapter.pages.findIndex((p) => p._id.toString() === pageId);

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
// ============================
// REORDER PAGES
// ============================

router.put("/:chapterId/pages/reorder", async (req, res) => {
  try {
    const { chapterId } = req.params;
    const { pages } = req.body;

    const chapter = await Chapter.findById(chapterId);

    if (!chapter) {
      return res.status(404).json({
        message: "Chapter not found",
      });
    }

    const reorderedPages = [];

    pages.forEach((page, index) => {
      const existingPage = chapter.pages.id(page._id);

      if (existingPage) {
        existingPage.pageNumber = index + 1;
        reorderedPages.push(existingPage);
      }
    });

    chapter.pages = reorderedPages;

    await chapter.save();

    res.json({
      message: "Pages reordered successfully",
      pages: chapter.pages,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

// ============================
// GET CHAPTER DETAILS
// ============================

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

// ============================
// GET STORY CHAPTERS
// ============================

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

// ============================
// UPDATE CHAPTER
// ============================

router.put("/:id", async (req, res) => {
  try {
    const { title, content } = req.body;

    const chapter = await Chapter.findByIdAndUpdate(
      req.params.id,
      {
        title,
        content,
      },
      {
        new: true,
      },
    );

    res.json(chapter);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

// ============================
// DELETE CHAPTER
// ============================

router.delete("/:id", async (req, res) => {
  try {
    await Chapter.findByIdAndDelete(req.params.id);

    res.json({
      message: "Chapter deleted",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

module.exports = router;
