const mongoose = require("mongoose");

const chatModeSchema = new mongoose.Schema({
  mode: {
    type: String,
    required: [true, "please select the mode for the chat"],
  },
  slowMode: {
    type: {
      value: { type: Boolean, default: false },
      time: Number,
    },
    // required: [true, "please selcet the room you want to communicate in!"],
  },
});

const chatMode = mongoose.model("chatMode", chatModeSchema);

module.exports = chatMode;
