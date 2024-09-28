const mongoose = require("mongoose");
const validator = require("validator");

const contactUsSchema = new mongoose.Schema({
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
  message: {
    type: String,
    minLength: [10, "your message should be more than 10 characters"],
    required: [true, "please enter a breif description!"],
  },
  topic: {
    type: String,
    required: [true, "please choose one of the below topics!"],
  },
  flagged: { type: Boolean, default: false },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const ContactUs = mongoose.model("ContactUs", contactUsSchema);

module.exports = ContactUs;
