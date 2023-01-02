const User = require("../models/user");

// add employee to reviewArray and it will be reflected in Employees to be reviewed list
module.exports.addToReview = function (req, res) {
  console.log(req.params.id);
  User.findByIdAndUpdate(
    req.user.id,
    {
      reviewArray: [...req.user.reviewArray, req.params.id],
    },
    function (err, user) {
      if (err) {
        console.log("Error in adding employee to review list", err);
        return;
      }
      console.log(user.reviewArray);
      user.save();
      return res.redirect("back");
    }
  );
};

// A bin icon to remove employee from the review list
module.exports.removeFromReviewList = function (req, res) {
  const newReviewArray = req.user.reviewArray.filter(
    (id) => id != req.params.id
  );
  User.findByIdAndUpdate(
    req.user.id,
    {
      reviewArray: newReviewArray,
    },
    function (err, user) {
      if (err) {
        console.log("Error in removing employee from review list", err);
        return;
      }
      console.log(user.reviewArray);
      user.save();
      return res.redirect("back");
    }
  );
};

// function to make an employee admin
module.exports.addAdmin = function (req, res) {
  User.findByIdAndUpdate(
    req.params.id,
    {
      isAdmin: true,
    },
    function (err, user) {
      if (err) {
        console.log("Error in promoting employee to admin", err);
        return;
      }
      user.save();
      return res.redirect("back");
    }
  );
};

// function to revoke employee's admin access
module.exports.deleteAdmin = function (req, res) {
  User.findByIdAndUpdate(
    req.params.id,
    {
      isAdmin: false,
    },
    function (err, user) {
      if (err) {
        console.log("Error in demoting admin to employee", err);
        return;
      }
      user.save();
      return res.redirect("back");
    }
  );
};
