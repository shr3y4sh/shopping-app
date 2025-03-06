const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('node_app', 'shrekko', 'abcdef', {
	host: 'localhost',
	port: 5432,
	dialect: 'postgres'
});

module.exports = sequelize;
