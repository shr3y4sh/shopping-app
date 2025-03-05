// const { patch } = require('./shop');
// const path = require('../util/path');

// const path = require('path');
// const rootDir = require('../util/path');

const express = require('express');

const adminController = require('../controllers/admin');
const routers = express.Router();

routers.get('/add-product', adminController.getAddProduct);

routers.get('/products', adminController.getProducts);

routers.post('/add-product', adminController.postAddProduct);

routers.get('/edit-product/:productId', adminController.getEditProduct);

routers.post('/edit-product', adminController.postEditProduct);

module.exports = routers;
