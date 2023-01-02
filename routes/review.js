const express = require("express");
const passport = require("passport");
const router = express.Router();

const reviewController = require("../controllers/review_controller");

router.get("/:id", passport.checkAuthentication, reviewController.reviewHome);
router.post(
  "/reviewer",
  passport.checkAuthentication,
  reviewController.addReviewer
);
router.post("/add", passport.checkAuthentication, reviewController.addReview);
router.get(
  "/update/:id",
  passport.checkAuthentication,
  reviewController.updateView
);
router.post(
  "/update-review/:id",
  passport.checkAuthentication,
  reviewController.updateReview
);

module.exports = router;
