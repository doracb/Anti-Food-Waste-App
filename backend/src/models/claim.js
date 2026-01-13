const sequelize = require("../sequelize");
const { DataTypes } = require("sequelize");

const Claim = sequelize.define(
  "Claim",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "accepted", "rejected"),
      allowNull: false,
      defaultValue: "pending",
    },
    food_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    claimant_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    tableName: "Claims",
    timestamps: true,
  }
);

module.exports = Claim;
