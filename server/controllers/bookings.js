const moment = require("moment");
const momentTimezone = require("moment-timezone");
const booking = require("../models/booking");
const { ObjectId } = require("mongoose").Types;
const Restaurant = require("../models/restaurant");

// Function to convert UTC JS Date object to a Moment.js object in AEST
const dateAEST = (date) => {
  return momentTimezone(date).tz("Asia/Kolkata");
};

// Function to calculate the duration of the hours between the start and end of the booking
const durationHours = (bookingStart, bookingEnd) => {
  // convert the UTC Date objects to Moment.js objeccts
  let startDateLocal = dateAEST(bookingStart);
  let endDateLocal = dateAEST(bookingEnd);
  // calculate the duration of the difference between the two times
  let difference = moment.duration(endDateLocal.diff(startDateLocal));
  // return the difference in decimal format
  return difference.hours() + difference.minutes() / 60;
};
// Defined store route
const addBookings = async function (req, res) {
  const { restaurant } = req.body;
  try {
    let _restaurant = await Restaurant.findById(restaurant);
    if (_restaurant) {
      let _booking = new booking({
        user: req.user,
        // The hour on which the booking starts, calculated from 12:00AM as time = 0
        startHour: dateAEST(req.body.bookingStart).format("H.mm"),
        // The duration of the booking in decimal format
        duration: durationHours(req.body.bookingStart, req.body.bookingEnd),
        // Spread operator for remaining attributes
        restaurant: restaurant,
        ...req.body,
      });
      _booking
        .save()
        .then(() => {
          res
            .status(201)
            .json({ message: "Table has been Booked successfully" });
        })
        .catch((error) => {
          res.status(400).json({ message: error.message });
        });
    } else {
      res
        .status(400)
        .json({ message: "You are trying to book a unknown restaurant" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Defined get data(index or listing) route
const getAllBookings = function (req, res) {
  const { restaurant } = req.query;
  var query = { user: req.user };
  if (restaurant) {
    query = { ...query, restaurant: new ObjectId(restaurant) };
  }
  booking.paginate(
    query,
    {
      page: req.query.page || 1,
      limit: req.query.limit || 10,
      sort: { createdAt: -1 },
      populate: ["user", "restaurant"],
    },
    function (err, bookings) {
      if (err) {
        return res.status(500).json(err);
      } else if (bookings) {
        return res.status(200).json(bookings);
      } else {
        return res
          .status(404)
          .json({ message: "Bookings not Found for this restaurant" });
      }
    }
  );
};

// Defined edit route
const getBookingsById = function (req, res) {
  const { bookingid } = req.params;
  booking.findById(bookingid, function (err, booking) {
    if (err) {
      return res.status(500).json(err);
    } else if (booking) return res.json(booking);
    return res
      .status(404)
      .json({ message: "booking your looking is no longer available" });
  });
};

//  Defined update route
const updateBookingsById = function (req, res) {
  const { bookingid } = req.params;
  const { bookingStart, bookingEnd, businessUnit, purpose } = req.body;
  booking.findById(bookingid, function (err, booking) {
    if (!booking)
      res
        .status(404)
        .json({ message: "Booking your looking is no longer available" });
    else {
      booking.bookingStart = bookingStart;
      booking.bookingEnd = bookingEnd;
      booking.businessUnit = businessUnit;
      booking.purpose = purpose;
      booking.startHour = dateAEST(req.body.bookingStart).format("H.mm");
      // The duration of the booking in decimal format
      booking.duration = durationHours(
        req.body.bookingStart,
        req.body.bookingEnd
      );
      booking
        .save()
        .then(() => {
          res.json({ message: "Booking has Updated successfully" });
        })
        .catch((error) => {
          res.status(400).json({ message: error.message });
        });
    }
  });
};

// Defined delete | remove | destroy route
const deleteBookingsById = function (req, res) {
  const { bookingid } = req.params;
  booking
    .findByIdAndRemove(bookingid)
    .then((booking) => {
      if (booking)
        return res.status(200).json({ message: "Booking has been cancelled" });
      else
        return res.status(404).json({ message: "Booking already cancelled " });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

module.exports = {
  addBookings,
  getAllBookings,
  getBookingsById,
  updateBookingsById,
  deleteBookingsById,
};
