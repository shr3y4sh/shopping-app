// const path = require('path');
// const rootDir = require('../util/path');

const express = require('express');
const shopController = require('../controllers/shop');
const authentication = require('../middleware/is-auth');
const router = express.Router();

// const adminData = require('./admin');

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);

router.post('/cart', authentication, shopController.postCart);

router.get('/cart', authentication, shopController.getCart);

router.post(
	'/cart-delete-item',
	authentication,
	shopController.postDeleteCartItem
);

router.post('/create-order', authentication, shopController.postOrder);

router.get('/orders', authentication, shopController.getOrders);

// router.get('/checkout', shopController.getCheckout);

module.exports = router;
