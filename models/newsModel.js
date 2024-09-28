const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "a news article must have a title!"],
  },
  description: {
    type: String,
    required: [true, "please enter a breif description!"],
  },

  coverImage: {
    type: String,
    required: [true, "upload a related image about the news article!"],
  },
  numOfSubnews: { type: Number, default: 1 },

  subNews: [
    {
      index: Number,
      title: String,
      description: String,
      image: String,
    },
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  changedAt: {
    type: Date,
  },
});
newsSchema.pre("save", function (next) {
  if (this.isNew) return next();

  this.changedAt = Date.now() - 1000;
  next();
});

const News = mongoose.model("News", newsSchema);

module.exports = News;
