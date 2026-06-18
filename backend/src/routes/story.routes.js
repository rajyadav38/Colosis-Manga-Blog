const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });
const Story = require("../models/Story");
const model = require("../config/gemini");
const Chapter = require("../models/Chapter");

// CREATE STORY
router.post("/create", upload.single("coverImage"), async (req, res) => {
  try {
    const story = await Story.create({
      authorId: req.body.authorId,
      authorUsername: req.body.authorUsername,

      title: req.body.title,
      description: req.body.description,

      type: req.body.type,

      genres: req.body.genres ? req.body.genres.split(",") : [],

      coverImage: req.file ? req.file.filename : "",
    });

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

router.put("/view/:id", async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({
        message: "Story not found",
      });
    }

    story.views += 1;

    await story.save();

    res.json({
      views: story.views,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

router.put("/like/:id", async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);

    story.likes += 1;

    await story.save();

    res.json(story);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
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
