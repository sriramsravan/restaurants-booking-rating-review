// Require User model in our routes module
let User = require("../models/user");

// Defined store route
const addUsers = function (req, res) {
  let user = new User(req.body);
  user
    .save()
    .then(() => {
      res.status(200).json({ message: "business in added successfully" });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

// Defined get data(index or listing) route
const getAllUsers = function (req, res) {
  User.paginate(
    {},
    {
      page: req.query.page || 1,
      limit: req.query.limit || 10,
      projection: { password: 0 },
    },
    function (err, posts) {
      if (err) {
        res.status(500).json(err);
      } else {
        res.json(posts);
      }
    }
  );
};

// Defined edit route
const getUsersById = function (req, res) {
  let id = req.params.id;
  User.findById(id, { password: 0 }, function (err, user) {
    if (err) {
      return res.status(500).json(err);
    } else if (user) return res.json(user);
    return res
      .status(404)
      .json({ message: "user your looking is no longer available" });
  });
};

//  Defined update route
const updateUsersById = function (req, res) {
  User.findById(req.params.id, function (err, user) {
    if (!user)
      res
        .status(404)
        .json({ message: "user your looking is no longer available" });
    else {
      Object.keys(req.body).forEach((k) => {
        if (req.body[k]) user[k] = req.body[k];
      });
      user
        .save()
        .then(() => {
          res.json({ message: "Update complete" });
        })
        .catch((err) => {
          console.log(err);
          res.status(400).json({ message: "unable to update the database" });
        });
    }
  });
};

// Defined delete | remove | destroy route
const deleteUsersById = function (req, res) {
  User.findByIdAndRemove({ _id: req.params.id }, function (err, user) {
    if (err) return res.status(500).json(err);
    else if (user) return res.json({ message: "Successfully removed" });
    return res
      .status(404)
      .json({ message: "user your looking is no longer available" });
  });
};

module.exports = {
  addUsers,
  getAllUsers,
  getUsersById,
  updateUsersById,
  deleteUsersById,
};
