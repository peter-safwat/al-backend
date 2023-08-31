const express = require("express");

const streamLinkController = require("../controllers/streamLinkController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(streamLinkController.getAllStreamLinks)
  .post(
    authController.protect,
    authController.restrictTo("Manager", "Moderator", "Admin"),
    streamLinkController.createstreamLink
  )
  .delete(
    authController.protect,
    authController.restrictTo("Manager", "Moderator", "Admin"),
    streamLinkController.deleteStreamLinks
  );

router
  .route("/:id")
  .patch(
    authController.protect,
    authController.restrictTo("Manager", "Moderator", "Admin"),
    streamLinkController.updateStreamLink
  )
  .get(streamLinkController.getStreamLink)
  .delete(
    authController.protect,
    authController.restrictTo("Manager", "Moderator", "Admin"),
    streamLinkController.deleteStreamLink
  );

module.exports = router;
