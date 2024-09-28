const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  message: {
    type: String,
    required: [
      true,
      "Feedback input is empty. Please enter your feedback before submitting. Thank you!",
    ],
    minLength: [
      16,
      "Feedback input is less than 16 characters. Please enter more detailed feedback before submitting. Thank you!",
    ],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  flagged: {
    type: Boolean,
    default: false,
  },
  num: {
    type: Number,
  },
});
feedbackSchema.pre("save", async function (next) {
  const doc = this; // the current user being saved
  const existedFeedbacks = await this.constructor.countDocuments({});
  doc.num = existedFeedbacks + 1;
  next();
});

const Feedback = mongoose.model("Feedback", feedbackSchema);

module.exports = Feedback;
