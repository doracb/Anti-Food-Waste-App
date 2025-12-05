const express = require("express");
const router = express.Router();
const foodController = require("../controllers/food.controller");

router.post("/", foodController.createFood);

router.get("/user/:user_id", foodController.getUserFoods);

router.get("/user/:userId/expiring")

router.put("/:id", foodController.updateFood);

router.delete("/:id", foodController.deleteFood);



module.exports = router;
