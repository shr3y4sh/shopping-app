const { body } = require('express-validator');
const express = require('express');

const adminController = require('../controllers/admin');
const authentication = require('../middleware/is-auth');
const routers = express.Router();

const productValidators = [
	body('title')
		.isString()
		.withMessage('No special characters')
		.isLength({ min: 3 })
		.withMessage('Title should be more than 3 characters'),
	body('price').isDecimal().withMessage('Price should be a decimal value'),
	body('description')
		.isLength({ min: 5, max: 300 })
		.withMessage('Description should be more than 5 characters')
];

routers.get('/add-product', authentication, adminController.getAddProduct);

routers.post(
	'/add-product',
	authentication,
	productValidators,
	adminController.postAddProduct
);

routers.post(
	'/edit-product',
	authentication,
	productValidators,
	adminController.postEditProduct
);

routers.get('/products', authentication, adminController.getProducts);

routers.get(
	'/edit-product/:productId',
	authentication,
	adminController.getEditProduct
);

routers.delete(
	'/product/:productId',
	authentication,
	adminController.deleteProduct
);

module.exports = routers;
