const express = require("express");
const authControllers = require("./../Controllers/authControllers");

const router = express.Router();

router.route("/signup").post(authControllers.signup);

module.exports = router;
