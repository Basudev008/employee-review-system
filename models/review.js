const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    reviewedEmployee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    feedback: {
      type: String,
      required: true,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
