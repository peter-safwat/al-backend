const express = require("express");

const sportsController = require("../controllers/sportsController");
const ServreAPIDataController = require("../controllers/ServreAPIDataController");
const authController = require("../controllers/authController");

const router = express.Router();

router.route("/teamNames").get(sportsController.getMatchByTeamNames);
router.route("/deleteOldData").get(sportsController.deleteOldData);

router.route("/customAPI").post(sportsController.createCustomAPI);

router.route("/makevote").patch(sportsController.MatchVote);
router.route("/poll").post(sportsController.createPoll);
// .patch(sportsController.updatePoll);

// .patch(sportsController.updatePoll);
// router.route("/updatepoll").patch(sportsController.updatePoll);

router
  .route("/")
  .get(
    sportsController.filterOldData,
     sportsController.getAllSports)
  .post(
    // authController.protect,
    // authController.restrictTo("Manager", "Moderator", "Admin"),
    sportsController.uploadEventImages,
    sportsController.handleNewFiles,
    sportsController.makeFileWillHoldStats,
    sportsController.test,
    sportsController.createSport
  )
  .delete(
    // authController.protect,
    // authController.restrictTo("Manager", "Moderator", "Admin"),
    // sportsController.deleteManyItemsRelatedData,
    sportsController.deleteSports
  );

router
  .route("/:id")
  .patch(
    // authController.protect,
    // authController.restrictTo("Manager", "Moderator", "Admin"),
    sportsController.uploadEventImages,
    sportsController.handleEditedFiles,
    sportsController.editFileWillHoldStats,
    sportsController.test,
    sportsController.updateSport
  )
  .get(sportsController.getSport)
  .delete(
    // authController.protect,
    // authController.restrictTo("Manager", "Moderator", "Admin"),

    sportsController.deleteOneItemRelatedData,
    sportsController.deleteSport
  );
router.route("/customAPI/:id").patch(sportsController.updateCustomAPI);

router.route("/eventAPIData/lineups").get(ServreAPIDataController.gitEventData);

router
  .route("/eventAPIData/statistics")
  .get(ServreAPIDataController.gitEventData);

router.route("/eventAPIData/events").get(ServreAPIDataController.gitEventData);

module.exports = router;
