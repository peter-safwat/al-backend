const express = require("express");

const sportsController = require("../controllers/sportsController");
const ServreAPIDataController = require("../controllers/ServreAPIDataController");
const authController = require("../controllers/authController");

const router = express.Router();

router.route("/teamNames").get(sportsController.getMatchByTeamNames);

router
  .route("/customAPI")
  .post(sportsController.createCustomAPI)
  .patch(sportsController.updateCustomAPI);

router
  .route("/")
  .get(
    sportsController.filterOldData,
    sportsController.getAllSports
  )
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
    sportsController.deleteManyItemsRelatedData,
    sportsController.deleteSports
  );

router
  .route("/:id")
  .patch(
    // authController.protect,
    // authController.restrictTo("Manager", "Moderator", "Admin"),
    sportsController.uploadEventImages,
    sportsController.handleEditedFiles,
    // sportsController.test,
    sportsController.updateSport
  )
  .get(sportsController.getSport)
  .delete(
    // authController.protect,
    // authController.restrictTo("Manager", "Moderator", "Admin"),

    sportsController.deleteOneItemRelatedData,
    sportsController.deleteSport
  );
router.route("/eventAPIData/lineups").get(ServreAPIDataController.gitEventData);

router
  .route("/eventAPIData/statistics")
  .get(ServreAPIDataController.gitEventData);

router.route("/eventAPIData/event").get(ServreAPIDataController.gitEventData);

module.exports = router;
