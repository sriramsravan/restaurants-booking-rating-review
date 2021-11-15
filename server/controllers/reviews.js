// Require Review model in our routes module
let Review = require("../models/review");

// Defined store route
const addReviews = function (req, res) {
  req.body.user = req.user;
  req.body.restaurant = req.params.restaurantId;
  let review = new Review(req.body);
  review
    .save()
    .then(() => {
      res.status(200).json({ message: "business in added successfully" });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

// Defined get data(index or listing) route
const getAllReviews = function (req, res) {
  let { restaurantId: restaurant } = req.params;
  Review.paginate(
    { restaurant },
    {
      page: req.query.page || 1,
      limit: req.query.limit || 10,
      sort: { createdAt: -1 },
      populate: ["user"],
    },
    function (err, posts) {
      if (err) {
        console.log(err);
        res.status(500).json(err);
      } else {
        res.json(posts);
      }
    }
  );
};

// Defined edit route
const getReviewsById = function (req, res) {
  let id = req.params.id;
  Review.findById(id, function (err, review) {
    if (err) {
      return res.status(500).json(err);
    } else if (review) return res.json(review);
    return res
      .status(404)
      .json({ message: "review your looking is no longer available" });
  });
};

//  Defined update route
const updateReviewsById = function (req, res) {
  Review.findById(req.params.id, function (err, review) {
    if (!review)
      res
        .status(404)
        .json({ message: "review your looking is no longer available" });
    else {
      Object.keys(req.body).forEach((k) => {
        review[k] = req.body[k];
      });
      review
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
const deleteReviewsById = function (req, res) {
  Review.findByIdAndRemove({ _id: req.params.id }, function (err, review) {
    if (err) return res.status(500).json(err);
    else if (review) return res.json({ message: "Successfully removed" });
    return res
      .status(404)
      .json({ message: "review your looking is no longer available" });
  });
};

module.exports = {
  addReviews,
  getAllReviews,
  getReviewsById,
  updateReviewsById,
  deleteReviewsById,
};
