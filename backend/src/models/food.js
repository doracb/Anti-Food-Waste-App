const sequelize = require("../sequelize");
const { DataTypes } = require("sequelize");

const Food = sequelize.define(
  "Food",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity_value: {
      type: DataTypes.FLOAT,
      allowNull: true,
      validate: {
        min: 0.1,
      },
    },
    quantity_unit: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    expiration_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    is_available: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    tableName: "Foods",
    timestamps: true,
  }
);

module.exports = Food;
