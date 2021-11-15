const express = require("express");
const bookingRoutes = express.Router();
// Require Booking model in our routes module
const {
  addBookings,
  getAllBookings,
  getBookingsById,
  updateBookingsById,
  deleteBookingsById,
} = require("../controllers/bookings");

// Defined store route
bookingRoutes.route("/").post(addBookings);

// Defined get data(index or listing) route
bookingRoutes.route("/").get(getAllBookings);

// Defined edit route
bookingRoutes.route("/:id").get(getBookingsById);

//  Defined update route
bookingRoutes.route("/:id").put(updateBookingsById);

// Defined delete | remove | destroy route
bookingRoutes.route("/:id").delete(deleteBookingsById);

module.exports = bookingRoutes;
