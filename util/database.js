const pg = require('pg');

const pool = new pg.Pool({
	host: 'localhost',
	user: 'shrekko',
	database: 'node_app',
	password: 'abcdef',
	port: 5432
});

module.exports = pool;
