const express = require("express");
const userRoutes = express.Router();
const roleCheck = require("../helper/auth");

// Require Post model in our routes module
const {
  addUsers,
  getAllUsers,
  getUsersById,
  updateUsersById,
  deleteUsersById,
} = require("../controllers/users");

// Defined store route
userRoutes.route("/").post(roleCheck(["admin"]), addUsers);

// Defined get data(index or listing) route
userRoutes.route("/").get(roleCheck(["admin"]), getAllUsers);

// Defined edit route
userRoutes.route("/:id").get(roleCheck(["admin"]), getUsersById);

//  Defined update route
userRoutes.route("/:id").put(roleCheck(["admin"]), updateUsersById);

// Defined delete | remove | destroy route
userRoutes.route("/:id").delete(roleCheck(["admin"]), deleteUsersById);

module.exports = userRoutes;
