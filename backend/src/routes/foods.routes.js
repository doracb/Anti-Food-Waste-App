const express = require("express");
const router = express.Router();
const foodController = require("../controllers/food.controller");

router.post("/", foodController.createFood);

router.get("/user/:user_id/expiring", foodController.getExpiringFoods);

router.get("/user/:user_id", foodController.getUserFoods);

router.get("/city/:city", foodController.getAvailableInCity);

router.patch("/:id/available/:user_id", foodController.markAsAvailable);

router.put("/:id", foodController.updateFood);

router.delete("/:id", foodController.deleteFood);

router.get("/:id", foodController.getFoodById);

module.exports = router;
