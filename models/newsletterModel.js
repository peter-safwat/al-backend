const mongoose = require("mongoose");
const validator = require("validator");
const AppError = require("../utils/appError");

const newsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "please provide a real email address!"],
    validate: {
      validator: function (email) {
        return validator.isEmail(email);
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  num: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});
newsletterSchema.pre("save", async function (next) {
  const doc = this; // the current user being saved
  const existedUser = await this.constructor.findOne({ email: doc.email });
  if (existedUser) {
    const error = new AppError("Email already exists", 409);
    return next(error);
  }
  const existedNewsletters = await this.constructor.countDocuments({});
  doc.num = existedNewsletters + 1;

  next();
});

const Newsletter = mongoose.model("Newsletter", newsletterSchema);

module.exports = Newsletter;
