const mongoose = require("mongoose");

const reportedLinkSchema = new mongoose.Schema({
  event: {
    type: String,
    required: [true, "please specify the event where you encountered an issue"],
  },
  server: {
    type: String,
    required: [
      true,
      "please specify the server where you encountered an issue.",
    ],
  },
  reason: {
    type: String,
    required: [
      true,
      "please specify the reason where you encountered an issue",
    ],
  },
  eventLink: {
    type: String,
    required: [true, "please specify the link where you encountered an issue"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const ReportedLink = mongoose.model("ReportedLink", reportedLinkSchema);

module.exports = ReportedLink;
