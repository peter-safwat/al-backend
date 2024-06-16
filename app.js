const express = require("express");
const morgan = require("morgan");
// const rateLimit = require('express-rate-limit');
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const cors = require("cors");
const bodyParser = require("body-parser");
// const cron = require("node-cron");

// const bodyParser = require("body-parser");

const globalErrorHandler = require("./controllers/errorController");
const userRouter = require("./routes/userRoutes");
const linksRouter = require("./routes/importantLinksRoutes");
const newsRouter = require("./routes/newsRoutes");
const conatctUsRouter = require("./routes/contactUsRoutes");
const newsletterRouter = require("./routes/newsletterRoutes");
const feedbackRouter = require("./routes/feedbackRoutes");
const streamLinksRouter = require("./routes/streamLinkRoutes");
const channelsRouter = require("./routes/channelsRoutes");
const giveawayRouter = require("./routes/giveawayRoutes");
const sportsRouter = require("./routes/sportsRoutes");
const serversRouter = require("./routes/serversRoutes");
const reportedLinksRouter = require("./routes/reportedLinksRoutes");
const statisticsRouter = require("./routes/statisticsRoutes");
const chatRouter = require("./routes/chatRoutes");
// const statisticsController = require("./controllers/statisticsController");
// const EventsLiveDataController = require("./controllers/EventsLiveDataController");
const AppError = require("./utils/appError");

const apiRouter = express.Router();
// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
apiRouter.use(helmet());

// Development logging
if (process.env.NODE_ENV === "development") {
  apiRouter.use(morgan("dev"));
}

// Limit requests from same API
// const limiter = rateLimit({
//   max: 100,
//   windowMs: 60 * 60 * 1000,
//   message: 'Too many requests from this IP, please try again in an hour!'
// });
// apiRouter.use('/api', limiter);

apiRouter.use(
  cors({
    origin: [
      "https://next14-aj.vercel.app",
      "http://localhost:3000",
      "http://localhost:3001",
      "https://dashboard-14.vercel.app",
    ],
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

apiRouter.use(express.json({ limit: "10000kb" }));
apiRouter.use((req, res, next) => {
  console.log("body");
  console.log(req.query);
  console.log(req.body);
  next();
});
apiRouter.use(express.json());
apiRouter.use(express.urlencoded({ extended: false }));
apiRouter.use(bodyParser.json());
apiRouter.use(express.static(`${__dirname}/public`));

// Data sanitization against NoSQL query injection
apiRouter.use(mongoSanitize());
// Serving static files

// Test middleware
apiRouter.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

// apiRouter.use((req, res, next) => {
//   const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
//   console.log("Client IP:", ip);
//   next();
// });

// 3) ROUTES

apiRouter.use("/contact-us", conatctUsRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/links", linksRouter);
apiRouter.use("/newsletter", newsletterRouter);
apiRouter.use("/feedback", feedbackRouter);
apiRouter.use("/channels", channelsRouter);
apiRouter.use("/giveaway", giveawayRouter);
apiRouter.use("/reportedLinks", reportedLinksRouter);

apiRouter.use("/news", newsRouter);
apiRouter.use("/sports", sportsRouter);
apiRouter.use("/servers", serversRouter);
apiRouter.use("/streamLink", streamLinksRouter);
apiRouter.use("/statistics", statisticsRouter);
apiRouter.use("/chat", chatRouter);

apiRouter.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

apiRouter.use(globalErrorHandler);

module.exports = apiRouter;
