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
    const { storyId, userId, username, rating, comment } = req.body;

    const existingReview = await Review.findOne({
      storyId,
      userId,
    });

    if (existingReview) {
      existingReview.rating = rating;
      existingReview.comment = comment;

      await existingReview.save();

      return res.json({
        message: "Review Updated",
        review: existingReview,
      });
    }

    const review = await Review.create({
      storyId,
      userId,
      username,
      rating,
      comment,
    });

    res.status(201).json({
      message: "Review Added",
      review,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

router.get("/user/:storyId/:userId", async (req, res) => {
  try {
    const review = await Review.findOne({
      storyId: req.params.storyId,
      userId: req.params.userId,
    });

    res.json(review);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);

    res.json({
      message: "Review Deleted",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
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
