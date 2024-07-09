const StreamLink = require("../models/streamLinkModel");
const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");

exports.getStreamLinkByName = catchAsync(async (req, res) => {
  const { channelName } = req.query;
  const result = await StreamLink.findOne({
    channelName: { $regex: channelName, $options: "i" },
    mode: "Visible",
  });

  delete req.query.channelName;
  res.status(200).json({
    status: "success",
    data: result,
  });
});

// exports.getAllStreamLinks = factory.getAll(StreamLink);
exports.getAllStreamLinks = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(StreamLink.find(), req.query)
    .sort()
    .filter()
    .paginate();
  const filtered = new APIFeatures(StreamLink.find(), req.query)
    .filter()
    .countDocs();
  const featuresStreamLinks = await features.query;
  const filteredStreamLinks = await filtered.query;
  const allLanguages = await StreamLink.distinct("language");
  res.status(200).json({
    status: "success",
    results: filteredStreamLinks,
    allLanguages: allLanguages,
    data: {
      data: featuresStreamLinks,
    },
  });
});

exports.createstreamLink = factory.createOne(StreamLink);
exports.deleteStreamLinks = factory.deleteMany(StreamLink);
exports.deleteStreamLink = factory.deleteOne(StreamLink);
exports.updateStreamLink = factory.updateOne(StreamLink);
exports.getStreamLink = factory.getOne(StreamLink);
exports.updateAll = async (req, res, next) => {
  try {
    // Define the update object
    const update = {
      mode: "Visible",
      language: "English",
    };

    // Perform the update
    const result = await StreamLink.updateMany({}, update);

    console.log(`Successfully updated ${result.nModified} documents.`);
  } catch (error) {
    console.error("Error updating documents:", error);
  }
};

// Do NOT update passwords with this!
