const express = require("express");
const restaurantRoutes = express.Router();
const roleCheck = require("../helper/auth");
// Require Restaurant model in our routes module
const {
  addRestaurants,
  getAllRestaurants,
  getRestaurantsById,
  updateRestaurantsById,
  deleteRestaurantsById,
} = require("../controllers/restaurants");
const reviews = require("./restaurants/reviews");
// const bookings = require("./bookings");

restaurantRoutes.use("/:restaurantId/reviews", reviews);

// restaurantRoutes.use("/:restaurantId/bookings", bookings);

// Defined store route
restaurantRoutes.route("/").post(roleCheck(["admin"]), addRestaurants);

// Defined get data(index or listing) route
restaurantRoutes.route("/").get(getAllRestaurants);

// Defined edit route
restaurantRoutes.route("/:id").get(getRestaurantsById);

//  Defined update route
restaurantRoutes.route("/:id").put(roleCheck(["admin"]), updateRestaurantsById);

// Defined delete | remove | destroy route
restaurantRoutes
  .route("/:id")
  .delete(roleCheck(["admin"]), deleteRestaurantsById);

module.exports = restaurantRoutes;
