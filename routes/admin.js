const express = require("express");
const passport = require("passport");
const router = express.Router();

const adminController = require("../controllers/admin_controller");

router.get(
  "/addtoreview/:id",
  passport.checkAuthentication,
  adminController.addToReview
);
router.get(
  "/remove/:id",
  passport.checkAuthentication,
  adminController.removeFromReviewList
);
router.get("/add/:id", passport.checkAuthentication, adminController.addAdmin);
router.get(
  "/delete/:id",
  passport.checkAuthentication,
  adminController.deleteAdmin
);

module.exports = router;
