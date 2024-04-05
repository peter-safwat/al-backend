/* eslint-disable for-direction */
const multer = require("multer");
// const fsPromise = require("fs").promises;

const News = require("../models/newsModel");
const factory = require("./handlerFactory");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const APIFeatures = require("../utils/apiFeatures");

exports.getAllnews = factory.getAll(News);
exports.getNewsItem = factory.getOne(News);
exports.createNews = factory.createOne(News);
exports.updateNews = factory.updateOne(News);
exports.deleteNews = factory.deleteOne(News);
exports.deleteManyNews = factory.deleteMany(News);
exports.test = (req, res, next) => {
  console.dir("test");
  console.dir(req.body);
  next();
};

exports.getNewsByTitle = catchAsync(async (req, res) => {
  const { title } = req.query;
  const result = await News.findOne({
    title: { $regex: title, $options: "i" },
  });
  res.status(200).json({
    status: "success",
    results: result.subNews.length,
    data: {
      data: result,
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
    cb(null, "public/img/news/");
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
exports.uploadNewsImages = upload.any();

exports.handleNewFiles = async (req, res, next) => {
  const filesRecieved = req.files.map((file) => ({
    [file.fieldname]: file.filename,
  }));
  filesRecieved.forEach((obj) => {
    req.body[Object.keys(obj)[0]] = obj[Object.keys(obj)[0]];
  });

  const subNews = [];
  for (let i = 1; i <= Number(req.body.numOfSubnews); i += 1) {
    const titleKey = `subNews-${i}-title`;
    const descriptionKey = `subNews-${i}-description`;
    const imageKey = `subNews-${i}-image`;

    const subb = {
      title: req.body[titleKey],
      description: req.body[descriptionKey],
      image: req.body[imageKey],
      index: i,
    };
    subNews.push(subb);
  }
  const data = {
    subNews: subNews,
    title: req.body.title,
    description: req.body.description,
    numOfSubnews: req.body.numOfSubnews,
    coverImage: req.body.coverImage,
  };
  req.body = data;

  next();
};
exports.handleEditedFiles = catchAsync(async (req, res, next) => {
  const filesRecieved = req.files.map((file) => ({
    [file.fieldname]: file.filename,
  }));
  filesRecieved.forEach((obj) => {
    req.body[Object.keys(obj)[0]] = obj[Object.keys(obj)[0]];
  });
  const doc = await News.findById(req.params.id);
  if (!doc) {
    return next(new AppError(`No document found with that ID`, 404));
  }
  const subNews = [];
  for (let i = 1; i <= Number(req.body.numOfSubnews); i += 1) {
    const titleKey = `subNews-${i}-title`;
    const descriptionKey = `subNews-${i}-description`;
    const imageKey = `subNews-${i}-image`;

    const subb = {
      title: req.body[titleKey],
      description: req.body[descriptionKey],
      image:
        req.body[imageKey] === "undefined" || req.body[imageKey] === "null"
          ? doc.subNews.find((item) => item.index === i).image
          : req.body[imageKey],
      index: i,
    };
    subNews.push(subb);
  }
  const data = {
    subNews: subNews,
    title: req.body.title,
    description: req.body.description,
    numOfSubnews: req.body.numOfSubnews,
    coverImage:
      req.body.coverImage === "undefined" || req.body.coverImage === "null"
        ? doc.coverImage
        : req.body.coverImage,
  };

  req.body = data;

  next();
});
