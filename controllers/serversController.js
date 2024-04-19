const ServerAndLangs = require("../models/serverAndLangsModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");

exports.createServers = factory.createOne(ServerAndLangs);
exports.deleteServers = factory.deleteOne(ServerAndLangs);
exports.updateServers = factory.updateOne(ServerAndLangs);
exports.getServers = catchAsync(async (req, res, next) => {
  const doc = await ServerAndLangs.find({ matchId: req.params.id });

  if (!doc) {
    return next(new AppError("No document found for this id", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data: doc,
    },
  });
});

// factory.getOne(ServerAndLangs);
