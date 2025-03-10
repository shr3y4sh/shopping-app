require('dotenv').config();
const { env } = require('process');

console.log(env.SEND_GRID_APIKEY);
