// const path = require('path');
// const rootDir = require('../util/path');

const express = require('express');
const shopController = require('../controllers/shop');
const router = express.Router();

// const adminData = require('./admin');

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/cart', shopController.getCart);

router.get('/checkout', shopController.getCheckout);

module.exports = router;
