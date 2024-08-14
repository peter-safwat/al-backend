const express = require("express");

const chatController = require("../controllers/chatController");
const authController = require("../controllers/authController");
const router = express.Router();

router.route("/vote").patch(chatController.makeVote);

router
  .route("/")
  .post(chatController.sendMessage)
  .get(chatController.getAllMessages)
  .delete(chatController.deleteMessages)
  .patch(chatController.updateMessages);
router.route("/:id").patch(chatController.updateMessage);

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

router
  .route("/chatMode")
  .post(chatController.createchatMode)
  // .patch(chatController.updateChatMode)
  .get(chatController.getChatMode);

router.route("/chatMode/:id").patch(chatController.updateChatMode);

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
router.route("/chatMembers").get(chatController.getChatMembers);
router
  .route("/bannedChatMembers")
  .post(chatController.banChatMembers)
  .get(chatController.getBannedChatMembers);
  router
  .route("/muteChatMember")
  .post(chatController.muteChatMember)

module.exports = router;
