const express = require("express");
const router = express.Router();

const Review = require("../models/Review");

router.get("/test", (req, res) => {
  res.json({
    message: "Review routes working",
  });
});
// CREATE REVIEW

router.post("/create", async (req, res) => {
  try {
    const review = await Review.create(req.body);

    res.status(201).json(review);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to create review",
    });
  }
});

// GET STORY REVIEWS

router.get("/:storyId", async (req, res) => {
  try {
    const reviews = await Review.find({
      storyId: req.params.storyId,
    }).sort({
      createdAt: -1,
    });

    res.json(reviews);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to fetch reviews",
    });
  }
});

module.exports = router;
