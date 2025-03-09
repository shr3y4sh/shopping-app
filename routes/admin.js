// const { patch } = require('./shop');
// const path = require('../util/path');

// const path = require('path');
// const rootDir = require('../util/path');

const express = require('express');

const adminController = require('../controllers/admin');
const authentication = require('../middleware/is-auth');
const routers = express.Router();

routers.get('/add-product', authentication, adminController.getAddProduct);

routers.post('/add-product', authentication, adminController.postAddProduct);

routers.post('/edit-product', authentication, adminController.postEditProduct);

routers.get('/products', authentication, adminController.getProducts);

routers.get(
	'/edit-product/:productId',
	authentication,
	adminController.getEditProduct
);

routers.post(
	'/delete-product',
	authentication,
	adminController.postDeleteProduct
);

module.exports = routers;
