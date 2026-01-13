const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('foodShare', 'postgres', 'catteam', {
    host: 'localhost',
    dialect: 'postgres'
});

module.exports = sequelize;