// Require Restaurant model in our routes module
let Restaurant = require("../models/restaurant");
const { ObjectId } = require("mongodb");

// Defined store route
const addRestaurants = function (req, res) {
  let restaurant = new Restaurant(req.body);
  restaurant
    .save()
    .then(() => {
      res.status(200).json({ message: "business in added successfully" });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

// Defined get data(index or listing) route
const getAllRestaurants = function (req, res) {
  let myAggregate = Restaurant.aggregate([
    {
      $lookup: {
        from: "reviews",
        localField: "_id",
        foreignField: "restaurant",
        as: "reviews",
      },
    },
    {
      $project: {
        name: 1,
        location: 1,
        description: 1,
        img: 1,
        rating: { $ifNull: [{ $avg: "$reviews.rating" }, 0] },
      },
    },
  ]);
  myAggregate.paginateExec(
    {
      page: req.query.page || 1,
      limit: req.query.limit || 10,
      sort: { rating: -1 },
    },
    function (err, restaurants) {
      if (err) {
        res.status(500).json(err);
      } else {
        res.json(restaurants);
      }
    }
  );
};

// Defined edit route
const getRestaurantsById = function (req, res) {
  let id = req.params.id;

  let myAggregate = Restaurant.aggregate([
    { $match: { _id: ObjectId(id) } },
    {
      $lookup: {
        from: "reviews",
        localField: "_id",
        foreignField: "restaurant",
        as: "reviews",
      },
    },
    {
      $project: {
        name: 1,
        location: 1,
        description: 1,
        img: 1,
        rating: { $ifNull: [{ $avg: "$reviews.rating" }, 0] },
        highRating: { $ifNull: [{ $max: "$reviews.rating" }, 0] },
        lowRating: { $ifNull: [{ $min: "$reviews.rating" }, 0] },
      },
    },
  ]).exec(function (err, restaurant) {
    // Restaurant.findById(id, function (err, restaurant) {
    if (err) {
      return res.status(500).json(err);
    } else if (restaurant[0]) return res.json(restaurant[0]);
    return res
      .status(404)
      .json({ message: "restaurant your looking is no longer available" });
  });
};

//  Defined update route
const updateRestaurantsById = function (req, res) {
  Restaurant.findById(req.params.id, function (err, restaurant) {
    if (!restaurant)
      res
        .status(404)
        .json({ message: "restaurant your looking is no longer available" });
    else {
      Object.keys(req.body).forEach((k) => {
        restaurant[k] = req.body[k];
      });
      restaurant
        .save()
        .then(() => {
          res.json({ message: "Update complete" });
        })
        .catch(() => {
          res.status(400).json({ message: "unable to update the database" });
        });
    }
  });
};

// Defined delete | remove | destroy route
const deleteRestaurantsById = function (req, res) {
  Restaurant.findByIdAndRemove(
    { _id: req.params.id },
    function (err, restaurant) {
      if (err) return res.status(500).json(err);
      else if (restaurant) return res.json({ message: "Successfully removed" });
      return res
        .status(404)
        .json({ message: "restaurant your looking is no longer available" });
    }
  );
};

module.exports = {
  addRestaurants,
  getAllRestaurants,
  getRestaurantsById,
  updateRestaurantsById,
  deleteRestaurantsById,
};
