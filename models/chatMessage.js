const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "a user must have a username"],
  },
  image: {
    type: String,
    required: [true, "a user must have an image"],
  },
  room: {
    type: String,
    required: [true, "please selcet the room you want to communicate in!"],
  },

  message: {
    type: String,
    required: [true, "please enter the message you want to send!"],
  },
  mode: {
    type: String,
    default: "normal",
  },
});

const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);

module.exports = ChatMessage;
