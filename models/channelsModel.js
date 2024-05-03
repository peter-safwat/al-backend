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

  // streamLinkName: {
  //   type: String,
  //   required: [true, "please enter the stream link name for this channel!"],
  // },
  // streamLinkUrl: {
  //   type: String,
  //   required: [true, "please enter the stream link url for this channel!"],
  // },
});

const Channels = mongoose.model("Channels", channelsSchema);

module.exports = Channels;
