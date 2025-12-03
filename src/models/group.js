const sequelize = require("../sequelize");
const { DataTypes } = require("sequelize");

const Group = sequelize.define("Group", {
     id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    owner_id: {
        type: DataTypes.UUID,
    references: {
        model: 'users',
        key: 'id'
    },
    allowNull: false,
    },
});

module.exports = Group;