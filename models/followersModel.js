const mongoose = require("mongoose");
// const AppError = require("../utils/appError");

const followerSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "please enter your fullname!"],
  },
  email: {
    type: String,
    required: [true, "please enter your email!"],
  },
  method: {
    type: String,
    required: [true, "please enter the method!"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  id: {
    type: Number,
    unique: true,
    default: function () {
      return Math.floor(Math.random() * (99999999 - 10000000 + 1)) + 10000000;
    },
  },
});
// followerSchema.pre("save", async function (next) {
//   const doc = this; // the current user being saved
//   const existedUser = await this.constructor.findOne({ email: doc.email });
//   if (existedUser) {
//     const error = new AppError("Email already exists", 409);
//     return next(error);
//   }
//   next();
// });

const Follower = mongoose.model("Follower", followerSchema);

module.exports = Follower;
