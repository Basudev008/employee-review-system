const express = require("express");
const passport = require("passport");
const router = express.Router();

const userController = require("../controllers/users_controller");

router.get("/", passport.checkAuthentication, userController.profile);
router.get("/sign-up", userController.signUp);
router.get("/sign-in", userController.signIn);
router.get("/update/:id", userController.updatePage);
router.post("/update-user/:id", userController.updateUser);

router.post("/create", userController.create);
router.post(
  "/create-session",
  passport.authenticate("local", {
    failureRedirect: "/user/sign-in",
  }),
  userController.createSession
);
router.get("/sign-out", userController.destroySession);

module.exports = router;
