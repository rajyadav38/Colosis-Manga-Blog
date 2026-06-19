const express = require("express");
const router = express.Router();

const Reel = require("../models/Reel");
const upload = require("../middleware/upload");
const cloudinary = require("../config/cloudinary");

router.post("/create", upload.single("video"), async (req, res) => {
  try {
    console.log("FILE RECEIVED");

    const { userId, username, caption } = req.body;

    // upload video to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "video",
      folder: "colosis_reels",
    });

    console.log("CLOUDINARY RESULT:");
    console.log(result);

    // save reel in mongodb
    const reel = new Reel({
      userId,
      username,
      caption,
      videoUrl: result.secure_url,
    });

    await reel.save();

    res.json({
      message: "Reel uploaded successfully",
      reel,
    });
  } catch (error) {
    console.log("UPLOAD ERROR:");
    console.error(error);

    res.status(500).json({
      message: "Upload failed",
      error: error.message,
    });
  }
});

// Get reels by user
router.get("/user/:userId", async (req, res) => {
  try {
    const reels = await Reel.find({
      userId: req.params.userId,
    }).sort({ createdAt: -1 });

    res.json(reels);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const reels = await Reel.find().sort({ createdAt: -1 });

    res.json(reels);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to fetch reels",
    });
  }
});

router.put("/like/:id", async (req, res) => {
  try {
    const { userId } = req.body;

    const reel = await Reel.findById(req.params.id);

    if (!reel) {
      return res.status(404).json({
        message: "Reel not found",
      });
    }

    // already liked
    if (reel.likedBy.includes(userId)) {
      return res.json({
        message: "Already liked",
        likes: reel.likes,
      });
    }

    reel.likes += 1;

    reel.likedBy.push(userId);

    await reel.save();

    res.json({
      likes: reel.likes,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

router.put("/comment/:id", async (req, res) => {
  try {
    const { username, text } = req.body;

    const reel = await Reel.findById(req.params.id);

    if (!reel) {
      return res.status(404).json({
        message: "Reel not found",
      });
    }

    reel.comments.push({
      username,
      text,
    });

    await reel.save();

    res.json({
      message: "Comment added",
      comments: reel.comments,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});
module.exports = router;
