const express = require("express");

const statisticsController = require("../controllers/statisticsController");
const router = express.Router();

router.route("/standings").get(statisticsController.getStandings);

router.route("/fixtures").get(statisticsController.getFixturesAndResults);

router.route("/results").get(statisticsController.getFixturesAndResults);

//   .delete
//     streamLinkController.deleteStreamLinks
//   );

module.exports = router;
