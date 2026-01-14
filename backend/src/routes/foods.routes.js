const express = require("express");
const router = express.Router();
const foodController = require("../controllers/food.controller");
const { protect } = require('../middleware/authMiddleware');

router.post("/", protect, foodController.createFood);

router.get("/user/:user_id/expiring", foodController.getExpiringFoods);

router.get("/user/:user_id", foodController.getUserFoods);

router.get("/city/:city", foodController.getAvailableInCity);

router.patch("/:id/available/:user_id", protect, foodController.markAsAvailable);

router.put("/:id", protect, foodController.updateFood);

router.delete("/:id", protect, foodController.deleteFood);

router.get("/:id", foodController.getFoodById);

module.exports = router;
