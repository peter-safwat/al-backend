const Feedback = require("../models/feedbackModel");
const factory = require("./handlerFactory");

exports.getAllFeedback = factory.getAll(Feedback);
exports.sendFeedback = factory.createOne(Feedback);
exports.deleteFeedback = factory.deleteOne(Feedback);
exports.updateFeedback = factory.updateOne(Feedback);
