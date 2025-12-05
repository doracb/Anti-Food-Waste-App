const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

router.post("/register", userController.register);
router.post("/login", userController.login);

router.get("/city/:city", userController.getUsersInCity);

router.get("/", userController.searchUser);

router.get("/:user_id", userController.getProfile);
router.put("/:user_id", userController.updateProfile);

module.exports = router;
