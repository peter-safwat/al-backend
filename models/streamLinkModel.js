const mongoose = require("mongoose");

const streamLinkSchema = new mongoose.Schema({
  channelName: {
    type: String,
    required: [true, "please enter the channel name for this stream link!"],
  },
  URL: {
    type: String,
    required: [true, "please enter the url for this stream link!"],
  },
  mode: {
    type: String,
    required: [true, "please chosse the mode for this channel!"],
  },
  language: {
    type: String,
    required: [true, "please enter the language for this channel!"],
  },

  // RMTPKey: {
  //   type: String,
  //   required: [true, "please enter the RMTPKey for this stream link!"],
  // },
});
streamLinkSchema.pre("save", function (next) {
  if (this.language) {
    this.language =
      this.language.charAt(0).toUpperCase() + this.language.slice(1);
  }
  next();
});

const StreamLink = mongoose.model("StreamLink", streamLinkSchema);

module.exports = StreamLink;
