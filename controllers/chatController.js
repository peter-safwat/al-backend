const path = require("path");
const fs = require("fs");

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

const membersFilePath = path.join(__dirname, "../", "activeMembers.json");
const bannedMembersFilePath = path.join(__dirname, "../", "bannedMembers.json");
const mutedMembersFilePath = path.join(__dirname, "../", "tempBan.json");

const readFromFile = (filePath) => {
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const data = fs.readFileSync(filePath, "utf8");
  return data ? JSON.parse(data) : [];
};
const writeToFile = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
};

exports.getChatMembers = (req, res, next) => {
  const members = readFromFile(membersFilePath);
  res.status(201).json({ status: "success", data: members });
};
exports.getBannedChatMembers = (req, res, next) => {
  const members = readFromFile(bannedMembersFilePath);
  res.status(201).json({ status: "success", data: members });
};
exports.banChatMembers = catchAsync(async (req, res, next) => {
  const { ip, name, type } = req.body;
  const oldBannedMembers = readFromFile(bannedMembersFilePath);
  let updatedBannedMembers;
  if (type === "ban") {
    updatedBannedMembers = [...oldBannedMembers, { name, ip }];
    await ChatMessage.deleteMany({ username: name });
  } else {
    updatedBannedMembers = oldBannedMembers.filter(
      (member) => member.ip !== ip
    );
  }
  console.log(updatedBannedMembers);
  writeToFile(bannedMembersFilePath, updatedBannedMembers);
  res.status(201).json({ status: "success", data: updatedBannedMembers });
});
exports.muteChatMember = catchAsync(async (req, res, next) => {
  const { ip, name } = req.body;
  const oldMutedMembers = readFromFile(mutedMembersFilePath);
  oldMutedMembers.push({ name: name, ip: ip });
  writeToFile(mutedMembersFilePath, oldMutedMembers);
  await ChatMessage.deleteMany({ username: name });
  res.status(201).json({ status: "success", data: oldMutedMembers });
});

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
