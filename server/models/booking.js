const moment = require("moment");

const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

var Schema = mongoose.Schema;
const bookingSchema = new Schema({
  user: { type: Schema.ObjectId, ref: "user" },
  bookingStart: Date,
  bookingEnd: Date,
  startHour: Number,
  duration: Number,
  tableNo: { type: Number, required: true },
  restaurant: { type: Schema.ObjectId, ref: "Restaurant" },
});
// Validation to ensure a Vehicle cannot be double-booked
bookingSchema.path("bookingStart").validate(function (value) {
  // Extract the Vehicle Id from the query object
  let restaurant = this.restaurant;
  const tableNo = this.tableNo;

  // Convert booking Date objects into a number value
  let newBookingStart = value.getTime();
  let newBookingEnd = this.bookingEnd.getTime();

  // Function to check for booking clash
  let clashesWithExisting = (
    existingBookingStart,
    existingBookingEnd,
    newBookingStart,
    newBookingEnd
  ) => {
    if (
      (newBookingStart >= existingBookingStart &&
        newBookingStart < existingBookingEnd) ||
      (existingBookingStart >= newBookingStart &&
        existingBookingStart < newBookingEnd)
    ) {
      throw new Error(
        `Booking could not be saved. There is a clash with an existing booking`
      );
    }
    return false;
  };

  // Locate the Vehicle document containing the bookings
  return Booking.find({ restaurant, tableNo }).then((booking) => {
    // Loop through each existing booking and return false if there is a clash
    return booking.every((booking) => {
      // Convert existing booking Date objects into number values
      let existingBookingStart = new Date(booking.bookingStart).getTime();
      let existingBookingEnd = new Date(booking.bookingEnd).getTime();

      // Check whether there is a clash between the new booking and the existing booking
      return !clashesWithExisting(
        existingBookingStart,
        existingBookingEnd,
        newBookingStart,
        newBookingEnd
      );
    });
  });
}, `{REASON}`);

bookingSchema.plugin(mongoosePaginate);

const Booking = (module.exports = mongoose.model("Booking", bookingSchema));
