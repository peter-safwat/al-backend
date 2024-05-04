const mongoose = require("mongoose");

const MatchPollSchema = new mongoose.Schema({
  enabled: { type: Boolean, default: false },
  inputs: {
    type: [
      {
        name: {
          type: String,
          required: [true, "Please enter the name for the input"],
        },
        value: {
          type: String,
          required: [true, "Please enter the value for the input"],
        },
        votes: {
          type: Number,
          default: 0, 
        },
      },
    ],
    required: [true, "Please enter the inputs values for match poll"],
  },
  totalVotes: {
    type: Number,
    default: 0,
  },
});
const MatchPoll = mongoose.model("MatchPoll", MatchPollSchema);

module.exports = MatchPoll;
