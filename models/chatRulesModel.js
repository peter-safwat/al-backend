const mongoose = require("mongoose");

const chatRulesSchema = new mongoose.Schema({
  rules: {
    type: Array,
    required: [true, "please enter the rules of the chat in an array form!"],
  },
});

const ChatRules = mongoose.model("ChatRules", chatRulesSchema);

module.exports = ChatRules;
