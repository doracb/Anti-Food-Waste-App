const sequelize = require("../sequelize");
const { DataTypes } = require("sequelize");

const GroupMember = sequelize.define("GroupMember", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  group_id: {
    type: DataTypes.UUID,
    references: {
        model: 'groups',
        key: 'id'
    },
    allowNull: false,
  },
  user_id: {
    type: DataTypes.UUID,
    references: {
        model: 'users',
        key: 'id'
    },
    allowNull: false,
  },
  tag: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

module.exports = GroupMember;