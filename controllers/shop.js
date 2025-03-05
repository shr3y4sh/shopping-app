const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res) => {
	Product.fetchAll((products) => {
		res.render('shop/product-list', {
			prods: products,
			pageTitle: 'All Products',
			path: '/products'
		});
	});
};

exports.getProduct = (req, res) => {
	const prodId = req.params.productId;
	Product.findById(prodId, (product) => {
		res.render('shop/product-detail', {
			product: product,
			pageTitle: product.title,
			path: '/products'
		});
	});
};

exports.getIndex = (req, res) => {
	Product.fetchAll((products) => {
		res.render('shop/index', {
			prods: products,
			pageTitle: 'Shop',
			path: '/'
		});
	});
};

exports.getCart = (req, res) => {
	res.render('shop/cart', {
		path: '/cart',
		pageTitle: 'Your Cart'
	});
};

exports.postCart = (req, res) => {
	const productId = req.body.productId.trim();

	Product.findById(productId, (product) => {
		Cart.addProduct(productId, product.price);
	});

	res.redirect('/cart');
};

exports.getCheckout = (req, res) => {
	res.render('shop/checkout', {
		path: '/checkout',
		pageTitle: 'Checkout'
	});
};
