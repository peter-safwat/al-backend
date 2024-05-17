const mongoose = require("mongoose");
const ChatRules = require("../models/chatRulesModel");
const ChatFilteredWords = require("../models/chatFilteredWords");
const ChatPoll = require("../models/chatPollModel");
const ChatMode = require("../models/chatModeModel");
const ChatMessage = require("../models/chatMessage");
// const APIFeatures = require("../utils/apiFeatures");
// const catchAsync = require("../utils/catchAsync");

const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");

const { ObjectId } = mongoose.Types;

exports.createchatRules = factory.createOne(ChatRules);
exports.updateChatRules = factory.updateOne(ChatRules);
exports.getChatRules = factory.getAll(ChatRules);

exports.createchatFilteredWords = factory.createOne(ChatFilteredWords);
exports.updateChatFilteredWords = factory.updateOne(ChatFilteredWords);
exports.getChatFilteredWords = factory.getAll(ChatFilteredWords);

exports.createchatPoll = factory.createOne(ChatPoll);
exports.getChatPolls = factory.getAll(ChatPoll);
exports.deletePolls = factory.deleteMany(ChatPoll);

exports.createchatMode = factory.createOne(ChatMode);
exports.getChatMode = factory.getAll(ChatMode);
exports.updateChatMode = factory.updateOne(ChatMode);

exports.getAllMessages = factory.getAll(ChatMessage);
exports.sendMessage = catchAsync(async (req, res, next) => {
  const { message } = req.body;
  // console.log(message);
  const postMessage = await ChatMessage.create(message);
  res.status(201).json({ status: "success", message: postMessage });
});
exports.deleteMessages = factory.deleteMany(ChatMessage);
exports.updateMessage = factory.updateOne(ChatMessage);
exports.updateMessages = catchAsync(async (req, res, next) => {
  // Convert array of strings to array of ObjectIDs
  const { idsToUpdate, updateData } = req.body;

  const objectIds = idsToUpdate.map((id) => new ObjectId(id));

  // Update documents with matching IDs
  const result = await ChatMessage.updateMany(
    { _id: { $in: objectIds } }, // Filter documents by IDs in the provided array
    { $set: updateData } // Update data
  );

  res
    .status(200)
    .json({ modifiedData: result, modifiedCount: result.modifiedCount });
});
exports.makeVote = catchAsync(async (req, res, next) => {
  const { pollId, voteValue } = req.body;
  const objectIdPollId = new ObjectId(pollId);
  const updatedPoll = await ChatPoll.findOneAndUpdate(
    { _id: objectIdPollId, "inputs.value": voteValue },
    {
      $inc: {
        "inputs.$.votes": 1, // Increment the votes for the specific input
        totalVotes: 1, // Increment the totalVotes by 1
      },
    },
    { new: true }
  );
  if (!updatedPoll) {
    return res.status(404).json({ error: "Poll not found or input not found" });
  }

  res.status(200).json({
    message: "Vote submitted successfully",
    poll: updatedPoll,
  });
});
