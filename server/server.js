const result = require("dotenv-flow").config();

if (result.error) {
  throw result.error;
}

const { PORT, MONGO_URI, ISDEBUG, SECRET } = process.env;

const config = require("./DB.js");

const express = require("express");
const app = express();
var compression = require("compression");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const cors = require("cors");
const mongoose = require("mongoose");

const passport = require("./passport/setup");
const User = require("./models/user");

const configureRoutes = require("./routes");

//  Creating mongoose instance
mongoose.Promise = global.Promise;
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    if (ISDEBUG) console.log(`MongoDB connected ${MONGO_URI}`);
  })
  .catch((err) => {
    throw err;
  });

const corsOptions = {
  origin: ["http://localhost:8080"],
  credentials: true,
};
app.use(cors(corsOptions));

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: SECRET,
    resave: false,
    expires: new Date(Date.now() + 60),
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

// Initializes passport and passport sessions
app.use(passport.initialize());
app.use(passport.session());

/* LOAD ROUTES DIRECTORY */
configureRoutes(app, process.env.API_PREFIX || "/api");

/*CALLBACK*/

//  Server initialization
const server = app.listen(PORT, function () {
  console.log(`Server backend is running ${PORT}`);
});
