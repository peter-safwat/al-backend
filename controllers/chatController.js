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

// exports.getAllMessages = catchAsync(async (req, res, next) => {
//   const { room } = req.body;
//   const result = await ChatMessage.find({ room: room || "English (Default)" });

//   // const result = await ChatMessage.aggregate([
//   //   {
//   //     $group: {
//   //       _id: '$room',
//   //       messages: { $push: '$$ROOT' },
//   //     },
//   //   },
//   // ]);

//   // // Convert the result to a more usable format
//   // const messagesByRoom = {};
//   // result.forEach((group) => {
//   //   messagesByRoom[group._id] = group.messages;
//   // });

//   // console.log(messagesByRoom);
//   res.status(200).json({ status: "success", messages: result });
// });

// exports.createChannel = factory.createOne(Channels);
// exports.deleteChannels = factory.deleteMany(Channels);
// exports.deleteChannel = factory.deleteOne(Channels);
// exports.updateChannel = factory.updateOne(Channels);
