const sequelize = require("../sequelize");
const { DataTypes } = require("sequelize");

const GroupMember = sequelize.define(
  "GroupMember",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    group_id: {
      type: DataTypes.UUID,
      references: {
        model: "Groups",
        key: "id",
      },
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
      references: {
        model: "Users",
        key: "id",
      },
      allowNull: false,
    },
    tag: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "GroupMembers",
    timestamps: true,
  }
);

module.exports = GroupMember;
