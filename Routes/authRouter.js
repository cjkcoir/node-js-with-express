const express = require("express");
const authControllers = require("./../Controllers/authControllers");

const router = express.Router();

router.route("/signup").post(authControllers.signup);
router.route("/login").post(authControllers.login);
router.route("/forgotPassword").post(authControllers.forgotPassword);
router.route("/resetPassword").post(authControllers.resetPassword);

module.exports = router;
