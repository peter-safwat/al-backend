const express = require("express");

const newsletterController = require("../controllers/newsletterController");

const router = express.Router();

router
  .route("/")
  .get(newsletterController.getAllUsers)
  .post(newsletterController.addUser);
router.route("/downloadEmails").get(newsletterController.downloadAllEmails);

module.exports = router;
