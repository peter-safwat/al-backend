const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();

// router.use(authController.restrictTo("Admin"));
router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser)
  .delete(userController.deleteManyUsers);

// websites users
router
  .route("/generateRandom")
  .post(userController.generateRandom);

router
  .route("/regulerUsers/tempMail/checkAvailability")
  .post(userController.checkUsernameAvailability);
router
  .route("/regulrUsers/tempMail")
  .post(userController.createTempUser)
  .delete(userController.deleteTempUser);

router
  .route("/regulerUsers/looks")
  .patch(userController.uploadUserImage, userController.updateUserLooks);

router
  .route("/regulerUsers")
  // .get(userController.getAllUsers)
  .post(userController.loginUser)
  .patch(userController.updateRegulerUser);

// router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);

router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

// Protect all routes after this middleware
// router.use(authController.protect);

router.patch("/updateMyPassword", authController.updatePassword);
router.get("/me", userController.getMe, userController.getUser);
// router.patch("/updateMe", userController.updateMe);
// router.delete("/deleteMe", userController.deleteMe);
router
  .route("/:id")
  .get(userController.getUser)
  .patch(authController.adminProtection, authController.updateUser);
module.exports = router;
