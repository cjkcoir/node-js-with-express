const express = require("express");
const authControllers = require("./../Controllers/authControllers");

const router = express.Router();

router.route("/signup").post(authControllers.signup);
router.route("/login").post(authControllers.login);
router.route("/forgotPassword").post(authControllers.forgotPassword);
router.route("/resetPassword/:token").patch(authControllers.resetPassword);
router
  .route("/updatePassword")
  .patch(authControllers.protect, authControllers.updatePassword);

module.exports = router;
