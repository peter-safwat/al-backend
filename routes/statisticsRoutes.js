const express = require("express");

const statisticsController = require("../controllers/statisticsController");
const router = express.Router();

router.route("/standings").get(statisticsController.getLeagueStandings);

router.route("/fixtures").get(statisticsController.getLeagueFixtures);

//   .delete(
//     streamLinkController.deleteStreamLinks
//   );

module.exports = router;
