const express = require("express");

const newsController = require("../controllers/newsController");

const router = express.Router();
router
  .route("/title").get(newsController.getNewsByTitle)

router
  .route("/")
  .get(newsController.getAllnews)
  .post(
    newsController.uploadNewsImages,
    newsController.handleNewFiles,
    newsController.createNews
  )
  .delete(
    // newsController.deleteManyItemsRelatedData,
    newsController.deleteManyNews
  );

router
  .route("/:id")
  .patch(
    newsController.uploadNewsImages,
    newsController.handleEditedFiles,
    newsController.updateNews
  )
  .get(newsController.getNewsItem)
  .delete(
    // newsController.deleteOneItemRelatedData,
    newsController.deleteNews
  );

module.exports = router;
