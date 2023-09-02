const fsPromise = require("fs").promises;
const fs = require("fs");
const util = require("util");

const multer = require("multer");
const Sport = require("../models/sportModel");
const factory = require("./handlerFactory");
const AppError = require("../utils/appError");
const ServersAndLangs = require("../models/serverAndLangsModel");

// const AppError = require("../utils/appError");

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
      )}-${Date.now()}.${file.mimetype.split("/")[1]}`
    );
  },
});

const upload = multer({ storage: storage, fileFilter: multerFilter });
exports.uploadTourImages = upload.fields([
  { name: "backgroundLogo", maxCount: 1 },
  { name: "leagueLogo", maxCount: 1 },
  { name: "firstTeamLogo", maxCount: 1 },
  { name: "secondTeamLogo", maxCount: 1 },
]);
exports.handleNewFiles = async (req, res, next) => {
  req.body.backgroundLogo = req.files.backgroundLogo[0].filename;
  req.body.leagueLogo = req.files.leagueLogo[0].filename;
  req.body.firstTeamLogo = req.files.firstTeamLogo[0].filename;
  req.body.secondTeamLogo = req.files.secondTeamLogo[0].filename;
  next();
};
exports.handleEditedFiles = async (req, res, next) => {
  try {
    const unlinkAsync = util.promisify(fs.unlink);

    if (!req.files) {
      next();
    }

    const editedItem = await Sport.findById(req.params.id);
    if (!editedItem) {
      next(new AppError("there is no doc found with that id", 404));
    }
    const { backgroundLogo, leagueLogo, firstTeamLogo, secondTeamLogo } =
      editedItem;
    // console.log(
    //   backgroundLogo,
    //   leagueLogo,
    //   firstTeamLogo,
    //   secondTeamLogo,
    //   req.files
    // );

    if (req.files.backgroundLogo) {
      await unlinkAsync(`public/img/matches/${backgroundLogo}`);
      req.body.backgroundLogo = req.files.backgroundLogo[0].filename;
    }
    if (req.files.leagueLogo) {
      await unlinkAsync(`public/img/matches/${leagueLogo}`);
      req.body.leagueLogo = req.files.leagueLogo[0].filename;
    }
    if (req.files.firstTeamLogo) {
      await unlinkAsync(`public/img/matches/${firstTeamLogo}`);
      req.body.firstTeamLogo = req.files.firstTeamLogo[0].filename;
    }
    if (req.files.secondTeamLogo) {
      await unlinkAsync(`public/img/matches/${secondTeamLogo}`);
      req.body.secondTeamLogo = req.files.secondTeamLogo[0].filename;
    }
    const data = { ...req.body };
    delete data.servers;
    req.body = data;
    next();
  } catch (error) {
    next(new AppError(error.message, error.statusCode));
  }
};
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
exports.getSport = factory.getOne(Sport);
exports.getAllSports = factory.getAll(Sport);
