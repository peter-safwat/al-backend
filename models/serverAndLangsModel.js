const mongoose = require("mongoose");
const AppError = require("../utils/appError");
const Sport = require("./sportModel");

const serversAndLanguagesSchema = new mongoose.Schema({
  matchId: [{ type: mongoose.Schema.Types.ObjectId, ref: "sport" }],

  mainLanguages: {
    english: {
      checked: { type: Boolean, default: false },
      num: Number,
      channels: [
        { name: String, serverValue: { name: String, streamLinkUrl: String } },
      ],
    },
    arabic: {
      checked: { type: Boolean, default: false },
      num: Number,
      channels: [
        { name: String, serverValue: { name: String, streamLinkUrl: String } },
      ],
    },
    spanish: {
      checked: { type: Boolean, default: false },
      num: Number,
      channels: [
        { name: String, serverValue: { name: String, streamLinkUrl: String } },
      ],
    },
  },
  moreLanguages: {
    checked: { type: Boolean, default: false },
    num: Number,
    otherLangs: [
      {
        index: Number,
        num: Number,
        channels: [],
        name: String,
        numOfServers: Number,
      },
    ],
  },
});
serversAndLanguagesSchema.pre("save", async function (next) {
  const existedEvent = await Sport.find({ _id: this.matchId });
  console.log("id", this.matchId, existedEvent);

  if (!existedEvent) {
    const error = new AppError("there is no match with this id  ", 409);
    return next(error);
  }
  next();
});
serversAndLanguagesSchema.post("save", async function (next) {
  await Sport.findByIdAndUpdate(this.matchId, {
    servers: this._id,
  });
});

const ServerAndLangs = mongoose.model(
  "ServerAndLangs",
  serversAndLanguagesSchema
);

module.exports = ServerAndLangs;
