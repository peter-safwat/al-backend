const Channels = require("../models/channelsModel");
const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");

exports.getChannelByName = catchAsync(async (req, res) => {
  const { channelName } = req.query;
  const result = await Channels.findOne({
    channelName: { $regex: channelName, $options: "i" },
    mode: "Visible",
  })
    .populate("streamLink")
    .exec();

  delete req.query.channelName;
  res.status(200).json({
    status: "success",
    data: result,
  });
});

exports.getAllChannels = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Channels.find(), req.query)
    .sort()
    .filter()
    .paginate();
  const filtered = new APIFeatures(Channels.find(), req.query)
    .filter()
    .countDocs();
  const featuresChannels = await features.query.populate("streamLink").exec();
  const filteredChannels = await filtered.query;
  const allLanguages = await Channels.distinct("language");
  console.dir(featuresChannels);
  res.status(200).json({
    status: "success",
    results: filteredChannels,
    allLanguages: allLanguages,
    data: {
      data: featuresChannels,
    },
  });
});

exports.createChannel = factory.createOne(Channels);
exports.deleteChannels = factory.deleteMany(Channels);
exports.deleteChannel = factory.deleteOne(Channels);
exports.updateChannel = factory.updateOne(Channels);
exports.getChannel = catchAsync(async (req, res) => {
  const result = await Channels.findById(req.params.id)
  .populate("streamLink")
  .exec();
  delete req.query.channelName;
  res.status(200).json({
    status: "success",
    data: result,
  });
});
// factory.getOne(Channels);

// Do NOT update passwords with this!
