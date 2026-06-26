const express = require("express");
const router = express.Router();
const Story = require("../models/Story");
const model = require("../config/gemini");
const Chapter = require("../models/Chapter");
const generateImage = require("../services/flux.service");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
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

router.post("/generate-pages/:id", async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id);

    if (!chapter) {
      return res.status(404).json({
        message: "Chapter not found",
      });
    }

    const story = await Story.findById(chapter.storyId);

    if (!story) {
      return res.status(404).json({
        message: "Story not found",
      });
    }

    if (story.type !== "manga" && story.type !== "comic") {
      return res.status(400).json({
        message:
          "Page generation is only available for manga and comic stories.",
      });
    }

    const prompt = `
You are a professional manga and comic storyboard artist.

Story Title:
${story.title}

Story Type:
${story.type}

Story Description:
${story.description}

Chapter Title:
${chapter.title}

Chapter Content:
${chapter.content}

Task:
Break this chapter into pages.

Return ONLY valid JSON.

Format:

{
  "pages": [
    {
      "pageNumber": 1,
      "description": "Detailed scene description"
    }
  ]
}

Rules:
- Decide the number of pages yourself.
- Keep important moments on separate pages.
- Make the pages feel cinematic.
- Do not return markdown.
- Do not return explanations.
`;

    const result = await model.generateContent(prompt);

    let text = result.response.text();

    text = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const generated = JSON.parse(text);

    const pages = [];

    for (const page of generated.pages) {
      let imagePrompt = "";

      if (story.type === "manga") {
        imagePrompt = `
Black and white manga page.
Professional manga artwork.
Detailed ink drawing.
Japanese manga style.
${page.description}
`;
      } else {
        imagePrompt = `
Colored western comic page.
Professional comic book illustration.
Cinematic composition.
${page.description}
`;
      }

      try {
        console.log("Generating image for page:");
        console.log(imagePrompt);
        const imageBuffer = await generateImage(imagePrompt);
        console.log("Image generated.");

        const uploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "colosis/generated-pages",
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            },
          );

          streamifier.createReadStream(imageBuffer).pipe(stream);
        });

        pages.push({
          pageNumber: page.pageNumber,
          caption: page.description,
          imageUrl: uploadResult.secure_url,
        });
      } catch (error) {
        console.log(`Failed Page ${page.pageNumber}`, error);

        pages.push({
          pageNumber: page.pageNumber,
          caption: page.description,
          imageUrl: "",
        });
      }
    }

    chapter.pages = pages;
    await chapter.save();

    res.json({
      message: "Pages generated successfully",
      pages: chapter.pages,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Generation Failed",
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
