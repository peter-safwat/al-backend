const fsPromise = require("fs").promises;
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const multer = require("multer");
const Sport = require("../models/sportModel");
const CustomAPI = require("../models/CustomAPI");
const MatchPoll = require("../models/MatchPoll");
const factory = require("./handlerFactory");
const AppError = require("../utils/appError");
const ServersAndLangs = require("../models/serverAndLangsModel");
const catchAsync = require("../utils/catchAsync");

const { ObjectId } = mongoose.Types;

const APIFeatures = require("../utils/apiFeatures");

const {
  sportCategoryApiDataTypes,
} = require("../utils/sportCategoryApiDataTypes");

// const AppError = require("../utils/appError");

const deleteFilesWithID = (id, folderPath) => {
  const directoryPath = path.join(folderPath);

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return console.error("Unable to read directory:", err);
    }

    files.forEach((file) => {
      if (file.includes(id)) {
        // Checks if the file contains the specific ID
        const filePath = path.join(directoryPath, file);

        fs.unlink(filePath, (err) => {
          if (err) {
            return console.error("Unable to delete file:", err);
          }
          // console.log(`Deleted file: ${filePath}`);
        });
      }
    });
  });
};
exports.deleteOldData = async (req, res, next) => {
  const currentTime = new Date();
  const result = await Sport.deleteMany({
    removeStream: { $lte: currentTime },
  });
  // console.log(`${result.deletedCount} document(s) deleted successfully.`);
  res.status(204).json({
    status: "success",
    data: null,
  });
};
exports.getMatchByTeamNames = catchAsync(async (req, res) => {
  // const { firstTeamName, secondTeamName } = req.query;
  let findQuery;
  if (req.query.firstTeamName && req.query.secondTeamName) {
    findQuery = {
      firstTeamName: { $regex: req.query.firstTeamName.trim(), $options: "i" },
      secondTeamName: {
        $regex: req.query.secondTeamName.trim(),
        $options: "i",
      },
      // removeStream: { gt: dateNow },
    };
  } else {
    findQuery = {
      teamsTitle: { $regex: req.query.teamsTitle.trim(), $options: "i" },
      // removeStream: { gt: dateNow },
    };
  }
  const result = await Sport.findOne(findQuery)
    .populate("servers")
    .populate("customAPI")
    .populate("matchPoll")
    .exec();
  res.status(200).json({
    status: "success",
    data: {
      data: result,
    },
  });
});

exports.filterOldData = catchAsync(async (req, res, next) => {
  const dateNow = new Date();

  req.query.removeStream = { gt: dateNow };
  next();
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
    cb(null, "public/img/matches/");
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
exports.uploadEventImages = upload.fields([
  { name: "backgroundLogo", maxCount: 1 },
  { name: "leagueLogo", maxCount: 1 },
  { name: "firstTeamLogo", maxCount: 1 },
  { name: "secondTeamLogo", maxCount: 1 },
  { name: "flagLogo", maxCount: 1 },
]);
exports.handleNewFiles = async (req, res, next) => {
  if (!req.files) {
    return next();
  }
  if (req.files.backgroundLogo) {
    req.body.backgroundLogo = req.files.backgroundLogo[0].filename;
  }
  if (req.files.leagueLogo) {
    req.body.leagueLogo = req.files.leagueLogo[0].filename;
  }
  if (req.files.firstTeamLogo) {
    req.body.firstTeamLogo = req.files.firstTeamLogo[0].filename;
  }
  if (req.files.secondTeamLogo) {
    req.body.secondTeamLogo = req.files.secondTeamLogo[0].filename;
  }
  if (req.files.flagLogo) {
    req.body.flagLogo = req.files.flagLogo[0].filename;
  }
  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of Object.entries(req.body)) {
    if (value === "null") {
      req.body[key] = null;
    }
  }
  next();
};
exports.makeFileWillHoldStats = catchAsync(async (req, res, next) => {
  if (!req.body.matchId) {
    return next();
  }
  const folderName = req.body.eventDate.split("T")[0];

  const basePath = path.join(__dirname, "../", "APIdata", "Matches");

  // Combine the base path and folder name to create the full path
  const { dataTypes } = sportCategoryApiDataTypes.find(
    (item) => item.sport === req.body.sportCategory
  );
  for (let i = 0; i < dataTypes.length; i = i + 1) {
    const folderFullullPath =
      req.body.sportCategory === "football"
        ? path.join(basePath, "Football", dataTypes[i], folderName)
        : path.join(basePath, "Others", dataTypes[i], folderName);
    // Check if the folder already exists

    if (!fs.existsSync(folderFullullPath)) {
      // Create the folder
      fs.mkdirSync(folderFullullPath, { recursive: true }, (err) => {
        if (err) {
          console.error("Error creating directory:", err);
        }
        //  else {
        //   console.log("Directory created successfully:", folderFullullPath);
        // }
      });

      // fs.mkdirSync(folderFullullPath);
      // console.log(`Folder "${folderFullullPath}" created successfully.`);
    }
    const timestamp = new Date(req.body.eventDate).getTime() / 1000;
    const fileName = `${req.body.matchId}-${timestamp}.json`;

    // Combine the base path and file name to create the full path
    const filrFullPath = path.join(folderFullullPath, fileName);

    // Create an empty file synchronously
    fs.writeFileSync(filrFullPath, "");
  }
  next();
});
exports.editFileWillHoldStats = catchAsync(async (req, res, next) => {
  if (!req.body.matchId) {
    return next();
  }

  const folderName = req.body.eventDate.split("T")[0];

  const basePath = path.join(__dirname, "../", "APIdata", "Matches");

  // Combine the base path and folder name to create the full path
  const { dataTypes } = sportCategoryApiDataTypes.find(
    (item) => item.sport === req.body.sportCategory
  );

  for (let i = 0; i < dataTypes.length; i = i + 1) {
    const folderFullullPath =
      req.body.sportCategory === "football"
        ? path.join(basePath, "Football", dataTypes[i], folderName)
        : path.join(basePath, "Others", dataTypes[i], folderName);
    // Check if the folder already exists
    deleteFilesWithID(req.body.matchId, folderFullullPath);
    if (!fs.existsSync(folderFullullPath)) {
      // Create the folder
      fs.mkdirSync(folderFullullPath, { recursive: true }, (err) => {
        if (err) {
          console.error("Error creating directory:", err);
        } 
        // else {
        //   console.log("Directory created successfully:", folderFullullPath);
        // }
      });
    }
    const timestamp = new Date(req.body.eventDate).getTime() / 1000;
    const fileName = `${req.body.matchId}-${timestamp}.json`;

    // Combine the base path and file name to create the full path
    const filrFullPath = path.join(folderFullullPath, fileName);

    // Create an empty file synchronously
    fs.writeFileSync(filrFullPath, "");
  }
  next();
});
exports.handleEditedFiles = catchAsync(async (req, res, next) => {
  if (!req.files) {
    return next();
  }

  if (req.files.backgroundLogo) {
    req.body.backgroundLogo = req.files.backgroundLogo[0].filename;
  }
  if (req.files.leagueLogo) {
    req.body.leagueLogo = req.files.leagueLogo[0].filename;
  }
  if (req.files.firstTeamLogo) {
    req.body.firstTeamLogo = req.files.firstTeamLogo[0].filename;
  }
  if (req.files.secondTeamLogo) {
    req.body.secondTeamLogo = req.files.secondTeamLogo[0].filename;
  }
  if (req.files.flagLogo) {
    req.body.flagLogo = req.files.flagLogo[0].filename;
  }
  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of Object.entries(req.body)) {
    if (value === "null") {
      req.body[key] = null;
    }
  }
  const data = { ...req.body };
  delete data.servers;
  req.body = data;
  delete req.body.servers;
  next();
});
exports.deleteManyItemsRelatedData = async (req, res, next) => {
  try {
    const events = await Sport.find({ _id: { $in: req.body } });
    // Create an array of promises to delete all the images
    const promises = events.map((item) => {
      const { backgroundLogo, leagueLogo, firstTeamLogo, secondTeamLogo } =
        item;

      return [
        fsPromise.unlink(`public/img/matches/${backgroundLogo}`),
        fsPromise.unlink(`public/img/matches/${leagueLogo}`),
        fsPromise.unlink(`public/img/matches/${firstTeamLogo}`),
        fsPromise.unlink(`public/img/matches/${secondTeamLogo}`),
      ];
    });
    // Wait for all the promises to be resolved
    await Promise.all(promises);

    await ServersAndLangs.deleteMany({
      matchId: { $in: req.body },
    });
  } catch (err) {
    next(new AppError(err.message, 404));
  }

  next();
};

exports.deleteOneItemRelatedData = async (req, res, next) => {
  try {
    const deletedItem = await Sport.findById(req.params.id);
    // Create an array of promises to delete all the images
    const promises = (item) => {
      const { backgroundLogo, leagueLogo, firstTeamLogo, secondTeamLogo } =
        item;

      return [
        fsPromise.unlink(`public/img/matches/${backgroundLogo}`),
        fsPromise.unlink(`public/img/matches/${leagueLogo}`),
        fsPromise.unlink(`public/img/matches/${firstTeamLogo}`),
        fsPromise.unlink(`public/img/matches/${secondTeamLogo}`),
      ];
    };

    // Wait for all the promises to be resolved
    await Promise.all(promises(deletedItem));

    await ServersAndLangs.findOneAndDelete({
      matchId: req.params.id,
    });
  } catch (err) {
    next(new AppError(err.message, 404));
  }

  next();
};
exports.createSport = factory.createOne(Sport);
exports.deleteSports = factory.deleteMany(Sport);
exports.deleteSport = factory.deleteOne(Sport);
exports.updateSport = factory.updateOne(Sport);
exports.getSport = catchAsync(async (req, res, next) => {
  const eventData = await Sport.findById(req.params.id)
    // .populate("servers")
    .populate("matchPoll")
    .populate("customAPI")
    .exec();
  res.status(200).json({
    status: "success",
    data: eventData,
  });
});
exports.getAllSports = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Sport.find(), req.query)
    .filter()
    .sort()
    .paginate();
  const allMatches = await features.query;
  const numQuery = new APIFeatures(Sport.find(), req.query)
    .filter()
    .countDocs();
  const num = await numQuery.query;
  req.query.flagged = true;
  req.query.limit = 10;
  req.query.skip = 0;
  const hotMatchesQuery = new APIFeatures(Sport.find(), req.query)
    .filter()
    .sort()
    .paginate();
  const hotMatches = await hotMatchesQuery.query;

  res.status(200).json({
    status: "success",
    results: num,
    hotMatches,
    data: {
      data: allMatches,
    },
  });
});
exports.createCustomAPI = factory.createOne(CustomAPI);
exports.updateCustomAPI = factory.updateOne(CustomAPI);
exports.createPoll = factory.createOne(MatchPoll);
// exports.updatePoll = factory.updateOne(MatchPoll);

exports.MatchVote = catchAsync(async (req, res, next) => {
  const { pollId, voteValue } = req.body;
  const objectIdPollId = new ObjectId(pollId);
  const updatedPoll = await MatchPoll.findOneAndUpdate(
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
// exports.updatePoll = catchAsync(async (req, res, next) => {
//   const { pollId, data } = req.body;
//   const objectIdPollId = new ObjectId(pollId);
//   const updatedPoll = await MatchPoll.findOneAndUpdate(
//     { _id: objectIdPollId },
//     { ...data },
//     { new: true }
//   );
//   if (!updatedPoll) {
//     return res.status(404).json({ error: "Poll not found or input not found" });
//   }

//   res.status(200).json({
//     message: "Vote submitted successfully",
//     poll: updatedPoll,
//   });
// });

exports.test = (req, res, next) => {
  // console.dir(req.body)
  next();
};
