const express = require("express");

const chatController = require("../controllers/chatController");
const authController = require("../controllers/authController");
const router = express.Router();

router
  .route("/")
  .post(chatController.sendMessage)
  .get(chatController.getAllMessages);

router
  .route("/chatRules")
  //   .get(channelsController.getAllChannels)
  .post(
    // authController.protect,
    // authController.restrictTo("Manager", "Moderator", "Admin"),
    chatController.createchatRules
  )
  .get(chatController.getChatRules);
router.route("/chatRules/:id").patch(chatController.updateChatRules);

router
  .route("/chatFilteredWords")
  //   .get(channelsController.getAllChannels)
  .post(
    // authController.protect,
    // authController.restrictTo("Manager", "Moderator", "Admin"),
    chatController.createchatFilteredWords
  )
  .get(chatController.getChatFilteredWords);
router
  .route("/chatFilteredWords/:id")
  .patch(chatController.updateChatFilteredWords);

router.route("/vote").patch(chatController.makeVote);

router
  .route("/chatPoll")
  //   .get(channelsController.getAllChannels)
  .post(
    // authController.protect,
    // authController.restrictTo("Manager", "Moderator", "Admin"),
    chatController.createchatPoll
  )
  .get(chatController.getChatPolls)
  .delete(chatController.deletePolls);
// router.route("/chatPoll/:id").delete(chatController.deletePoll);

module.exports = router;
