const requireContext = require("../require-context");
// this call will resolve relative to where require-context.js is:
// use its path as base dir when using relative routes
// in that case, with just traverse routes directory looking for routes
const requireRoutes = requireContext("./routes", false, /\.js$/);
const path = require('path');
const configureRoutes = (app, apiPrefix) => {
  for (const file of requireRoutes.keys()) {
    const name = path.parse(file).name;
    if (name === "index") {
      continue;
    }
    // console.info(`File: ${file}`);
    // console.info(`Name: ${name}`);
    const route = requireRoutes(file);
    // allow use default export (export default) or its own namespace (module.exports)
    if (name !== "auth")
      app.use(`${apiPrefix}/${name}`, authMiddleware, route.default || route);
    else
      app.use(`${apiPrefix}/${name}`, route.default || route);

  }
};
const authMiddleware = (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ message: "You are not authenticated" });
  } else {
    return next();
  }
};
module.exports = configureRoutes;
