const Review = require("../models/review");
const User = require("../models/user");

// renders the review form where you can add feedback for given employee
module.exports.reviewHome = function (req, res) {
  User.findById(req.params.id, function (err, user) {
    if (err) {
      console.log("Error in finding user", err);
      return;
    }
    return res.render("add_review", {
      title: "Review Page",
      reviewUser: user,
    });
  });
};

// function is called upon submitting the form in home page
// also removes the employee's id from reviewArray of loggedIn user
module.exports.addReview = async function (req, res) {
  let review = await Review.create(req.body);

  var user = await User.findById(req.body.reviewedEmployee);
  user.reviews.push(review._id);
  user.save();

  let reviewingUser = await User.findById(req.body.reviewedBy);
  reviewingUser.reviewArray = reviewingUser.reviewArray.filter(
    (id) => id != req.body.reviewedEmployee
  );
  reviewingUser.save();
  req.flash("success", "Review added Successfully");

  return res.redirect("/user");
};

// function to add another employee to a given employee
module.exports.addReviewer = async function (req, res) {
  let user = await User.findOne({ email: req.body.reviewerEmail });

  console.log(user);
  console.log(user.reviewArray);

  if (user.id != req.body.reviewedEmployee) {
    user.reviewArray.push(req.body.reviewedEmployee);
    user.save();
  }
  req.flash("success", `Reviewer ${req.body.reviewerEmail} added Successfully`);
  return res.redirect("/user");
};

// function to render form to update reviews done by logged in user
module.exports.updateView = async function (req, res) {
  let review = await Review.findById(req.params.id)
    .populate("reviewedEmployee")
    .populate("reviewedBy");

  return res.render("update_review", {
    title: "Update Review",
    review,
  });
};

// function to update feedback in an already existing review
module.exports.updateReview = async function (req, res) {
  let review = await Review.findById(req.params.id);

  review.feedback = req.body.feedback;
  review.save();

  req.flash("success", "Review updated Successfully");
  return res.redirect("/user");
};
