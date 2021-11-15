const express = require("express");
const reviewRoutes = express.Router({ mergeParams: true });
const roleCheck = require("../../helper/auth");
// Require Review model in our routes module
const {
  addReviews,
  getAllReviews,
  getReviewsById,
  updateReviewsById,
  deleteReviewsById,
} = require("../../controllers/reviews");

// Defined store route
reviewRoutes.route("/").post(roleCheck(["admin", "user"]), addReviews);

// Defined get data(index or listing) route
reviewRoutes.route("/").get(getAllReviews);

// Defined edit route
reviewRoutes.route("/:id").get(getReviewsById);

//  Defined update route
reviewRoutes.route("/:id").put(roleCheck(["admin"]), updateReviewsById);

// Defined delete | remove | destroy route
reviewRoutes.route("/:id").delete(roleCheck(["admin"]), deleteReviewsById);

module.exports = reviewRoutes;
