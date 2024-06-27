const fsPromise = require("fs").promises;
const fs = require("fs");
const path = require("path");

const catchAsync = require("../utils/catchAsync");

exports.gitEventLineups = catchAsync(async (req, res, next) => {
  const { matchId, sportCategory, eventDate } = req.query;
  const formattedDate = eventDate.split("T")[0];
  const category = sportCategory === "football" ? "Football" : "Others";
  const folderPath = path.join(
    __dirname,
    "../",
    "../",
    "APIdata",
    "Matches",
    category,
    "Lineups",
    formattedDate
  );
  const fileList = await fsPromise.readdir(folderPath);

  const requiredFile = fileList.find((fileName) => {
    const [, eventId, timestamp] = fileName.match(/(\d+)-(\d+)\.json/) || [];
    return eventId && timestamp && matchId === eventId;
  });

  const filePath = path.join(folderPath, requiredFile);
  const fileContent = fs.readFileSync(filePath, "utf8");

  // Parse the JSON content
  const jsonData = JSON.parse(fileContent);
  res.status(200).json({
    status: "success",
    data: jsonData,
  });
});
exports.gitEventStatistics = catchAsync(async (req, res, next) => {
  const { matchId, sportCategory, eventDate } = req.query;
  const formattedDate = eventDate.split("T")[0];
  const category = sportCategory === "football" ? "Football" : "Others";
  const folderPath = path.join(
    __dirname,
    "../",
    "../",

    "APIdata",
    "Matches",
    category,
    "Statistics",
    formattedDate
  );
  if (!fs.existsSync(folderPath)) {
    return res.status(200).json({
      status: "success",
      data: null,
    });
  }
  const fileList = await fsPromise.readdir(folderPath);

  const requiredFile = fileList.find((fileName) => {
    const [, eventId, timestamp] = fileName.match(/(\d+)-(\d+)\.json/) || [];
    return eventId && timestamp && matchId === eventId;
  });

  const filePath = path.join(folderPath, requiredFile);
  const fileContent = fs.readFileSync(filePath, "utf8");

  // Parse the JSON content
  const jsonData = JSON.parse(fileContent);
  res.status(200).json({
    status: "success",
    data: jsonData,
  });
});
exports.gitEventData = catchAsync(async (req, res, next) => {
  const { matchId, sportCategory, eventDate, dataType } = req.query;
  const formattedDate = eventDate.split("T")[0];
  const category = sportCategory === "football" ? "Football" : "Others";
  const folderPath = path.join(
    __dirname,
    // "../",
    "../",
    "APIdata",
    "Matches",
    category,
    dataType,
    formattedDate
  );
  if (!fs.existsSync(folderPath)) {
    return res.status(200).json({
      status: "success",
      data: null,
      folderPath: folderPath,
    });
  }
  const fileList = await fsPromise.readdir(folderPath);

  const requiredFile = fileList.find((fileName) => {
    const [, eventId, timestamp] = fileName.match(/(\d+)-(\d+)\.json/) || [];
    return eventId && timestamp && matchId === eventId;
  });

  const filePath = path.join(folderPath, requiredFile);
  const fileContent = fs.readFileSync(filePath, "utf8");

  // Parse the JSON content
  const jsonData = JSON.parse(fileContent);
  res.status(200).json({
    status: "success",
    data: jsonData,
  });
});
