const mongoosePaginate = require("mongoose-paginate-v2");
const mongoose = require("mongoose");
var Schema = mongoose.Schema;
const reviewSchema = new Schema(
  {
    user: { type: Schema.ObjectId, ref: "user" },
    restaurant: { type: Schema.ObjectId, ref: "Restaurant" },
    comment: { type: String, required: true },
    dateVisit: { type: Date, required: true },
    rating: { type: Number, min: 0, max: 5, required: true },
  },
  { timestamps: true }
);
reviewSchema.plugin(mongoosePaginate);

const Review = (module.exports = mongoose.model("review", reviewSchema));
