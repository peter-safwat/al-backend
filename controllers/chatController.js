const ChatRules = require("../models/chatRulesModel");
const ChatFilteredWords = require("../models/chatFilteredWords");
const ChatPoll = require("../models/chatPollModel");
const ChatMessage = require("../models/chatMessage");
// const APIFeatures = require("../utils/apiFeatures");
// const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");

exports.createchatRules = factory.createOne(ChatRules);
exports.updateChatRules = factory.updateOne(ChatRules);
exports.getChatRules = factory.getAll(ChatRules);

exports.createchatFilteredWords = factory.createOne(ChatFilteredWords);
exports.updateChatFilteredWords = factory.updateOne(ChatFilteredWords);
exports.getChatFilteredWords = factory.getAll(ChatFilteredWords);

exports.createchatPoll = factory.createOne(ChatPoll);
exports.getChatPolls = factory.getAll(ChatPoll);
exports.deletePolls = factory.deleteMany(ChatPoll);

exports.getAllMessages = factory.getAll(ChatMessage);
exports.sendMessage = catchAsync(async (req, res, next) => {
  const { message } = req.body;
  // console.log(message);
  const postMessage = await ChatMessage.create(message);
  console.log(postMessage);
  res.status(201).json({ status: "success", message: postMessage });
});

exports.makeVote = catchAsync(async (req, res, next) => {
  const { pollId, voteValue } = req.body;

  const updatedPoll = await ChatPoll.findOneAndUpdate(
    { _id: pollId, "inputs.value": voteValue },
    { $inc: { "inputs.$.votes": 1 } },
    { new: true }
  );

  if (!updatedPoll) {
    return res.status(404).json({ error: "Poll not found or input not found" });
  }

  let totalVotes = 0;
  updatedPoll.inputs.forEach((input) => {
    totalVotes += input.votes;
  });

  // Include total votes in the response
  res.status(200).json({
    message: "Vote submitted successfully",
    poll: updatedPoll,
    totalVotes: totalVotes,
  });
});
