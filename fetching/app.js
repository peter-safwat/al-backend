const express = require("express");
const cron = require("node-cron");

const bodyParser = require("body-parser");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const statisticsController = require("./controllers/statisticsController");
const EventsLiveDataController = require("./controllers/EventsLiveDataController");
const DeleteOldDataController = require("./controllers/DeleteOldDataController");

const app = express();
// 1) GLOBAL MIDDLEWARES

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json({ limit: "10000kb" }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

// cron.schedule("* */1 * * * *", statisticsController.getStandingsScheduledData);

// cron.schedule(
//   "* * */1 * * *",
//   statisticsController.getFixturesAndResultsForLeaguesScheduledData
// );

// cron.schedule(
//   "* * */9 * * *",
//   statisticsController.getFixturesAndResultsForCupsScheduledData
// );

cron.schedule(
  "0 * * * * *",
  EventsLiveDataController.gitFootballLiveMatchesData
);
cron.schedule(
  "0 * * * * *",
  EventsLiveDataController.gitOtherSportsLiveMatchesData
);
cron.schedule("0 2 * * *", DeleteOldDataController.deletOldSportsEvents);

// 3) ROUTES
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
