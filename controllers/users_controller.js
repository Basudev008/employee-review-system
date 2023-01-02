const Review = require("../models/review");
const User = require("../models/user");

//render user profile
module.exports.profile = function (req, res) {
  console.log("hello");
  console.log(req.user);
  User.find({ _id: { $ne: req.user._id } })
    .populate({
      path: "reviews",
      populate: {
        path: "reviewedEmployee",
      },
      populate: {
        path: "reviewedBy",
      },
    })
    .exec(function (err, users) {
      if (err) {
        console.log("Error in finding users", err);
        return;
      }

      User.findById(req.user.id)
        .populate("reviewArray")
        .exec(function (err, user) {
          if (err) {
            console.log("Error in finding user and populating review array");
            return;
          }
          Review.find({ reviewedBy: req.user.id })
            .populate("reviewedEmployee")
            .populate("reviewedBy")
            .exec(function (err, reviews) {
              if (err) {
                console.log("Error in finding reviews", err);
                return;
              }
              return res.render("user_profile", {
                title: "User Profile",
                users,
                currentUser: user,
                reviews,
              });
            });
        });
    });
};

module.exports.signUp = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/user");
  }
  return res.render("user_sign_up", {
    title: "placement | Sign Up",
  });
};

module.exports.signIn = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/user");
  }
  return res.render("user_sign_in", {
    title: "placement | Sign In",
  });
};

module.exports.create = function (req, res) {
  if (req.body.password != req.body.confirm_password) {
    return res.redirect("back");
  }

  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      console.log("error in finding user");
      return;
    }

    if (!user) {
      User.create(
        { ...req.body, isAdmin: false, reviewArray: [], reviews: [] },
        function (err, user) {
          if (err) {
            console.log("error in creating user while signing up");
            return;
          }

          return res.redirect("/user/sign-in");
        }
      );
    } else {
      return res.redirect("/user/sign-in");
    }
  });
};

// sign in and create a session for the user
module.exports.createSession = function (req, res) {
  req.flash("success", "Logged in Successfully!");
  return res.redirect("/user");
};

// sign out a user
module.exports.destroySession = function (req, res) {
  req.logout(function (err) {
    if (err) {
      console.log(err);
      return next(err);
    }
    req.flash("success", "You have logged out!");
    return res.redirect("/");
  });
};

// function to render form to update details of an employee
// if you are an admin you can update details of other employees
module.exports.updatePage = async function (req, res) {
  let user = await User.findById(req.params.id);
  return res.render("update_employee", {
    title: "Update Page",
    updateUser: user,
  });
};

// function to update details of an employee
module.exports.updateUser = function (req, res) {
  if (req.body.oldPassword === req.user.password) {
    if (req.body.password === req.body.confirm_password) {
      User.findByIdAndUpdate(req.params.id, req.body, function (err, user) {
        if (err) {
          console.log("Error in updating user", err);
          return;
        }
        return res.redirect("/user");
      });
    } else {
      req.flash("error", "Passwords do not match");
      return res.redirect("back");
    }
  } else {
    req.flash("error", "Please enter correct old password");
    return res.redirect("back");
  }
};
