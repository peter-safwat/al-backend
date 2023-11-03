const multer = require("multer");

// const  = require("../models/channelsModel");
const Follower = require("../models/followersModel");
const GiveawayEvent = require("../models/giveawayEventModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");
const { findOne } = require("../models/administratorModel");

exports.getAllFollowers = factory.getAll(Follower);
exports.createFollower = factory.createOne(Follower);
exports.deleteFollowers = factory.deleteMany(Follower);
exports.createGiveawayPrize = factory.createOne(GiveawayEvent);
exports.getEvent = catchAsync(async (req, res, next) => {
  const event = await GiveawayEvent.findOne();
  res.status(200).json({
    status: "success",
    data: {
      data: event,
    },
  });
});
exports.getEventEntries = catchAsync(async (req, res, next) => {
  const entries = await Follower.find();
  const userEntry = entries.filter((item) => item.email === req.query.email);
  const methods = ["Id-Badge", "Mail", "Telegram", "Twitter", "Retweet"];

  const result = await Follower.aggregate([
    { $match: { method: { $in: methods } } },
    { $group: { _id: "$method", num: { $sum: 1 } } },
  ]);
  console.log("data");
  console.log(entries);
  console.log(userEntry);
  console.log(result);
  res.status(200).json({
    status: "success",
    data: {
      totalEntries: entries.length,
      userEntry: userEntry.length,
      categoryEntries: result,
    },
  });
});
// factory.getAll(GiveawayEvent);
exports.generateWinner = catchAsync(async (req, res, next) => {
  const randomUser = await Follower.aggregate([{ $sample: { size: 1 } }]);
  res.status(201).json({
    status: "success",
    data: {
      data: randomUser[0],
    },
  });
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/img/giveaway/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${file.originalname.slice(
        0,
        file.originalname.lastIndexOf(".")
      )}-${Date.now()}.${file.originalname.slice(
        file.originalname.lastIndexOf(".") + 1
      )}`
    );
  },
});

const upload = multer({ storage: storage, fileFilter: multerFilter });
exports.uploadNewsImages = upload.single("prizeImage");

exports.handleNewFiles = async (req, res, next) => {
  req.body.prizeImage = req.file.filename;
  next();
};
exports.handleEditedFiles = catchAsync(async (req, res, next) => {
  const event = await GiveawayEvent.findOne();
  if (!event) {
    return next(new AppError(`No document found with that ID`, 404));
  }
  if (req.file) {
    req.body.prizeImage = req.file.filename;
  } else if (req.body.prizeImage === "null") {
    req.body.prizeImage = null;
  } else {
    req.body.prizeImage = event.prizeImage;
  }
  next();
});
exports.updateGiveawayPrize = catchAsync(async (req, res, next) => {
  const event = await GiveawayEvent.findOneAndUpdate(
    {},
    req.body
    // { $set: req.body },
    // {
    //   new: true,
    //   runValidators: false,
    //   context: "query",
    // }
  );
  if (!event) {
    return next(new AppError(`No document found with that ID`, 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      data: event,
    },
  });
});
// factory.updateOne(GiveawayEvent);
