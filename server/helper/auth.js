module.exports = (roles) => {
  return (req, res, next) => {
    if (roles.includes(req.user.role)) {
      return next();
    } else {
      return res
        .status(403)
        .json({ message: "You don't have permission for this action" });
    }
  };
};
