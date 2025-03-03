const Product = require('../models/product');

const getProducts = (req, res) => {
	Product.fetchAll((products) => {
		res.render('shop/product-list', {
			prods: products,
			pageTitle: 'All Products',
			path: '/products'
		});
	});
};

const getIndex = (req, res) => {
	Product.fetchAll((products) => {
		res.render('shop/index', {
			prods: products,
			pageTitle: 'Shop',
			path: '/'
		});
	});
};

const getCart = (req, res) => {
	res.render('shop/cart', {
		path: '/cart',
		pageTitle: 'Your Cart'
	});
};

const getCheckout = (req, res) => {
	res.render('shop/checkout', {
		path: '/checkout',
		pageTitle: 'Checkout'
	});
};

module.exports = { getProducts, getIndex, getCart, getCheckout };
