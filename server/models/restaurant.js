// Restaurant.model.js

const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const Schema = mongoose.Schema;

// Define collection and schema for Restaurant
let Restaurant = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      default: function () {
        return `https://via.placeholder.com/500x200.png?text=${this.name
          .split(" ")
          .join("+")}`;
      },
    },
    location: {
      type: String,
    },
    description: {
      type: String,
    },
    startTime: {
      type: String,
    },
    endTime: {
      type: String,
    },
  },
  {
    collection: "restaurants",
  }
);
Restaurant.plugin(mongoosePaginate);
Restaurant.plugin(aggregatePaginate);

module.exports = mongoose.model("Restaurant", Restaurant);
