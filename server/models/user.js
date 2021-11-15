const mongoose = require("mongoose"),
  bcryptjs = require("bcryptjs"),
  { SECRET } = process.env;
var Schema = mongoose.Schema,
  SALT_WORK_FACTOR = 10,
  jwt = require("jsonwebtoken");
const mongoosePaginate = require("mongoose-paginate-v2");

var UserSchema = new Schema(
  {
    email: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    FName: { type: String, required: true },
    LName: { type: String, required: true },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
);

UserSchema.pre("save", function (next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();

  // generate a salt
  bcryptjs.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcryptjs.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcryptjs.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

UserSchema.methods.generateJWT = function () {
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate(), 60);

  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      firstName: this.firstName,
      surName: this.surName,
      exp: parseInt(exp.getTime() / 1000),
    },
    SECRET
  );
};

UserSchema.methods.toAuthJSON = function () {
  return {
    username: this.username,
    email: this.email,
    token: this.generateJWT(),
    bio: this.bio,
    FName: this.FName,
    LName: this.LName,
    image: this.image,
    role: this.role,
  };
};
UserSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("user", UserSchema);
