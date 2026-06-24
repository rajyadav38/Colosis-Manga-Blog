const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const cloudinary = require("../config/cloudinary");
const upload = multer({
  storage: multer.memoryStorage(),
});
const Story = require("../models/Story");
const model = require("../config/gemini");
const Chapter = require("../models/Chapter");

// CREATE STORY

router.post("/create", upload.single("coverImage"), async (req, res) => {
  try {
    let coverImageUrl = "";

    if (req.file) {
      const streamifier = require("streamifier");

      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "colosis/story-covers",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

      coverImageUrl = result.secure_url;
    }

    const story = await Story.create({
      authorId: req.body.authorId,
      authorUsername: req.body.authorUsername,

      title: req.body.title,
      description: req.body.description,

      type: req.body.type,

      genres: req.body.genres ? req.body.genres.split(",") : [],

      coverImage: coverImageUrl,
    });

    res.status(201).json(story);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create story",
    });
  }
});

// Get all stories by author
router.get("/author/:authorId", async (req, res) => {
  try {
    const stories = await Story.find({
      authorId: req.params.authorId,
    }).sort({ createdAt: -1 });

    res.json(stories);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
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
router.get("/published", async (req, res) => {
  try {
    const stories = await Story.find({
      isPublished: true,
    }).sort({
      publishedAt: -1,
    });

    res.json(stories);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

router.post("/generate-book/:id", async (req, res) => {
  try {
    const storyId = req.params.id;

    const story = await Story.findById(storyId);

    const chapters = await Chapter.find({
      storyId,
    }).sort({
      chapterNumber: 1,
    });

    const chapterText = chapters
      .map((c) => `Chapter ${c.chapterNumber}: ${c.title}\n\n${c.content}`)
      .join("\n\n");

    const prompt = `
You are a professional book formatter.

Story Title:
${story.title}

Author:
${story.authorUsername}

Description:
${story.description}

Story Content:
${chapterText}

Requirements:
- Return ONLY HTML
- Show the author's username exactly as provided
- Do not invent author names
- Add title page
- Add chapter headings
- Add proper spacing
- Make it look like a real book
`;

    let result;

    for (let i = 0; i < 3; i++) {
      try {
        result = await model.generateContent(prompt);
        break;
      } catch (err) {
        if (i === 2) throw err;

        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }

    let html = result.response.text();

    html = html
      // Remove markdown code fences
      .replace(/```html/gi, "")
      .replace(/```/g, "")

      // Remove AI-generated styles that break UI
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/text-shadow:[^;]+;/gi, "")
      .replace(/filter:[^;]+;/gi, "")
      .replace(/opacity:[^;]+;/gi, "")

      // Clean whitespace
      .trim();

    story.generatedBookHtml = html;

    await story.save();

    res.json({
      message: "Book Generated",
      html,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Generation Failed",
    });
  }
});

router.put("/publish/:id", async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({
        message: "Story not found",
      });
    }

    story.isPublished = true;
    story.publishedAt = new Date();

    await story.save();

    res.json({
      message: "Story Published Successfully",
      story,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Publish Failed",
    });
  }
});

router.put("/view/:id/:userId", async (req, res) => {
  try {
    const { id, userId } = req.params;

    const story = await Story.findById(id);

    if (!story) {
      return res.status(404).json({
        message: "Story not found",
      });
    }

    if (!story.viewedBy.includes(Number(userId))) {
      story.views += 1;
      story.viewedBy.push(Number(userId));

      await story.save();
    }

    res.json(story);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

router.put("/like/:id/:userId", async (req, res) => {
  try {
    const { id, userId } = req.params;

    const story = await Story.findById(id);

    if (!story) {
      return res.status(404).json({
        message: "Story not found",
      });
    }

    const uid = Number(userId);

    if (story.likedBy.includes(uid)) {
      story.likes -= 1;

      story.likedBy = story.likedBy.filter((id) => id !== uid);
    } else {
      story.likes += 1;

      story.likedBy.push(uid);
    }

    await story.save();

    res.json(story);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});
router.post("/upload-page", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No image uploaded",
      });
    }

    const streamifier = require("streamifier");

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "colosis/manga-pages",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );

      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });

    res.json({
      imageUrl: result.secure_url,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Upload Failed",
    });
  }
});

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
