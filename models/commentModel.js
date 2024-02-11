const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  text: String,
  author: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  article: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "News",
  },
});
const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
