const mongoose = require("mongoose");

const sportSchema = new mongoose.Schema({
  flagged: {
    type: Boolean,
    default: false,
  },
  sportCategory: {
    type: String,
    lowercase: true,
    required: [true, "please enter the sports category"],
  },
  teamsTitle: {
    type: String,
    required: [
      function () {
        return this.firstTeamName === null && this.secondTeamName === null;
      },
      "Please provide either First Team Name and Second Team Name, or a Title",
    ],
  },
  firstTeamName: {
    type: String,
    required: [
      function () {
        return this.teamsTitle == null;
      },
      "Please provide either First Team Name and Second Team Name, or a Title",
    ],
  },
  secondTeamName: {
    type: String,
    required: [
      function () {
        return this.teamsTitle == null;
      },
      "Please provide either First Team Name and Second Team Name, or a Title",
    ],
  },
  eventDate: {
    type: Date,
    required: [true, "please enter the date of the event"],
  },
  matchId: {
    type: Number,
    default: null,
  },

  eventLeague: {
    type: String,
    required: [true, "please enter the league of the event"],
  },
  eventStadium: {
    type: String,
    required: [true, "please enter the stadium of the event"],
  },
  backgroundLogo: {
    type: String,
    // required: [true, "please enter the background of the event"],
  },
  leagueLogo: {
    type: String,
    // required: [true, "please enter the league of the event"],
  },
  firstTeamLogo: {
    type: String,
    // required: [
    //   function () {
    //     return this.flagLogo == null;
    //   },
    //   "Please provide either firstTeamLogo and secondTeamLogo, or flagLogo",
    // ],
  },
  secondTeamLogo: {
    type: String,
    // required: [
    //   function () {
    //     return this.flagLogo == null;
    //   },
    //   "Please provide either firstTeamLogo and secondTeamLogo, or flagLogo",
    // ],
  },
  flagLogo: {
    type: String,
    //     required: [function() {
    //       return this.firstTeamLogo == null && this.secondTeamLogo == null;
    //     }, 'Please provide either firstTeamLogo and secondTeamLogo, or flagLogo']
    //   }
  },
  playStream: {
    type: Date,
    required: [true, "please enter the date when the streams begins"],
  },
  removeStream: {
    type: Date,
    required: [true, "please enter the date for removing the streams"],
  },
  removeCountdown: {
    type: Date,
    required: [true, "please enter the date for removing the countdown"],
  },
  endedEvent: {
    type: Date,
    required: [true, "please enter the date for endedEvent"],
  },
  // showsPoll: { type: Boolean, default: false },
  // firstTeamPoll: String,
  // secondTeamPoll: String,
  servers: [{ type: mongoose.Schema.Types.ObjectId, ref: "ServerAndLangs" }],
  customAPI: { type: mongoose.Schema.Types.ObjectId, ref: "CustomAPI" },
  matchPoll: { type: mongoose.Schema.Types.ObjectId, ref: "MatchPoll" },
});

const Sport = mongoose.model("Sport", sportSchema);

module.exports = Sport;
