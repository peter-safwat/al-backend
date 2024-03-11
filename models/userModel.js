const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "a user must have a name!"],
  },
  email: {
    type: String,
    default: "dummyTempMail@dummy.com",
  },

  image: {
    type: String,
    default: "/svg/chat/avatars/Avatars/222.svg",
  },
  color: {
    type: String,
    default: "rgb(183, 29, 255)",
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});
const User = mongoose.model("User", userSchema);

module.exports = User;
