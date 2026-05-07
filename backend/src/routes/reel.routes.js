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

module.exports = router;
