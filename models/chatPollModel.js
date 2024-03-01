const mongoose = require("mongoose");

const ChatPollSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, "please enter the question of the poll!"],
  },
  time: {
    type: Number,
    required: [true, "please enter the time to show the poll in minutes"],
  },
  inputs: {
    type: Array,
    required: [true, "please enter the inputs values for the poll question"],
  },
  createdAt: {
    type: Date,
    // default: Date.now(),
    required: [true, "please enter the date now"],
  },
});

const ChatPoll = mongoose.model("ChatPoll", ChatPollSchema);

module.exports = ChatPoll;
