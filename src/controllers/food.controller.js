const Food = require("../models/food");
const User = require("../models/user");
const { Op } = require("sequelize");

exports.createFood = async (req, res) => {
  try {
    const {
      name,
      category,
      quantity_value,
      quantity_unit,
      expiration_date,
      user_id,
    } = req.body;
    if (!name || !category || !expiration_date || !user_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    if (quantity_value != null && quantity_value < 0.1) {
      return res
        .status(400)
        .json({ message: "Quantity value must be a number greater than 0.1" });
    }
    const food = await Food.create({
      name,
      category,
      quantity_value: quantity_value ?? null,
      quantity_unit: quantity_unit || null,
      expiration_date,
      user_id,
    });
    return res.status(201).json(food);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getUserFoods = async (req, res) => {
  try {
    const { user_id } = req.params;
    const foods = await Food.findAll({
      where: { user_id },
      order: [["createdAt", "DESC"]],
    });
    return res.status(200).json(foods);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAvailableInCity = async (req, res) => {
  try {
    const { city } = req.params;
    const foods = await Food.findAll({
      where: {
        is_available: true,
      },
      include: [
        {
          model: User,
          where: { city },
          attributes: ["id", "name", "username", "city"],
        },
      ],
    });
    return res.status(200).json(foods);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateFood = async (req, res) => {
  try {
    const food = await Food.findByPk(req.params.id);
    if (!food) {
      return res.status(404).json({ message: "Food item not found" });
    }

    if (req.body.quantity_value !== null && req.body.quantity_value < 0.1) {
      return res.status(400).json({ message: "Quantity must be >= 0.1" });
    }

    await food.update({
      name: req.body.name ?? food.name,
      category: req.body.category ?? food.category,
      quantity_value: req.body.quantity_value ?? food.quantity_value,
      quantity_unit: req.body.quantity_unit ?? food.quantity_unit,
      expiration_date: req.body.expiration_date ?? food.expiration_date,
    });
    return res.status(200).json(food);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteFood = async (req, res) => {
  try {
    const food = await Food.findByPk(req.params.id);
    if (!food) {
      return res.status(404).json({ message: "Food item not found" });
    }
    await food.destroy();
    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.markAsAvailable = async (req, res) => {
  try {
    const{ id, user_id } = req.params; 
    
    const food = await Food.findByPk(id);
    if (!food) {
      return res.status(404).json({ message: "Food item not found" });
    }

    if (!user_id) {
      return res.status(400).json({ message: "user_id is mandatory" });
    }

    if (food.user_id !== user_id) {
      return res.status(401).json({ message: "Not your food" });
    }

    food.is_available = true;
    await food.save();
    return res.status(200).json({ message: "Food item marked as available" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getExpiringFoods = async (req, res) => {
  try {
    const { user_id } = req.params;

    const today = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(today.getDate() + 3);

    const foods = await Food.findAll({
      where: {
        user_id,
        expiration_date: {
          [Op.between]: [today, threeDaysFromNow],
        },
      },
    });
    return res.status(200).json(foods);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
