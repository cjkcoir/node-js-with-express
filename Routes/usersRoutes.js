const express = require("express");

const userControllers = require("./../Controllers/userControllers");
const authControllers = require("./../Controllers/authControllers");

const router = express.Router();
router
  .route("/updatePassword")
  .patch(authControllers.protect, userControllers.updatePassword);

router
  .route("/updateMe")
  .patch(authControllers.protect, userControllers.updateMe);

router
  .route("/deleteMe")
  .delete(authControllers.protect, userControllers.deleteMe);

router.route("/getAllUsers").get(userControllers.getAllUsers);

module.exports = router;
