const mongoose = require("mongoose");

const channelsSchema = new mongoose.Schema({
  channelName: {
    type: String,
    required: [true, "please enter the name for this channel!"],
  },
  mode: {
    type: String,
    required: [true, "please chosse the mode for this channel!"],
  },
  language: {
    type: String,
    required: [true, "please enter the language for this channel!"],
  },
  streamLink: { type: mongoose.Schema.Types.ObjectId, ref: "StreamLink" },

});

const Channels = mongoose.model("Channels", channelsSchema);

module.exports = Channels;
