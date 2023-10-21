const express = require("express");

const giveawayController = require("../controllers/giveawayController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/folllower")
  .get(giveawayController.getAllFollowers)
  .post(giveawayController.createFollower)
  .delete(
    // authController.protect,
    // authController.restrictTo("Manager", "Moderator", "Admin"),
    giveawayController.deleteFollowers
  );
  router
  .route("/eventEntries")
  .get(giveawayController.getEventEntries)

router
  .route("/event")
  .post(
    // authController.protect,
    // authController.restrictTo("Manager", "Moderator", "Admin"),
    giveawayController.uploadNewsImages,
    giveawayController.handleNewFiles,
    giveawayController.createGiveawayPrize
  )
  .patch(
    // authController.protect,
    // authController.restrictTo("Manager", "Moderator", "Admin"),
    giveawayController.uploadNewsImages,
    giveawayController.handleEditedFiles,
    giveawayController.updateGiveawayPrize
  )
  .get(giveawayController.getEvent);
router.route("/winner").get(
  // authController.protect,
  // authController.restrictTo("Manager", "Moderator", "Admin"),
  giveawayController.generateWinner
);

// router
//   .route("/:id")
//   .patch(giveawayController.updateChannel)
//   .get(giveawayController.getChannel)
//   .delete(giveawayController.deleteChannel);

module.exports = router;
