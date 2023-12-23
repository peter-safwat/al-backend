const mongoose = require("mongoose");

const chatFilteredWordsSchema = new mongoose.Schema({
  words: {
    type: Array,
    required: [
      true,
      "please enter the filtered words of the chat in an array form!",
    ],
  },
});

const ChatFilteredWords = mongoose.model(
  "ChatFilteredWords",
  chatFilteredWordsSchema
);

module.exports = ChatFilteredWords;
