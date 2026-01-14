const { Sequelize } = require('sequelize');
require('dotenv').config(); 

let sequelize;

if (process.env.DATABASE_URL) {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        protocol: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
        logging: false
    });
} else {
    sequelize = new Sequelize('foodShare', 'postgres', 'catteam', {
        host: 'localhost',
        dialect: 'postgres',
        logging: false
    });
}

module.exports = sequelize;