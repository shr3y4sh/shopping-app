const Product = require('../models/product');

exports.getProducts = async (req, res) => {
	try {
		const result = await Product.fetchAll();

		res.render('shop/product-list', {
			prods: result,
			pageTitle: 'All Products',
			path: '/products'
		});
	} catch (error) {
		console.log(error);
	}
};

exports.getProduct = async (req, res) => {
	try {
		const prodId = req.params.productId;
		const result = await Product.findBySerial(prodId);

		res.render('shop/product-detail', {
			product: result,
			pageTitle: result.title,
			path: '/products'
		});
	} catch (error) {
		console.log(error);
	}
};

exports.getIndex = async (req, res) => {
	try {
		const result = await Product.fetchAll();
		console.log(req.user);

		res.render('shop/index', {
			prods: result,
			pageTitle: 'Shop',
			path: '/'
		});
	} catch (error) {
		console.log(error);
	}
};

exports.getCart = async (req, res) => {
	try {
		const cartProducts = await req.user.getCart();

		res.render('shop/cart', {
			path: '/cart',
			pageTitle: 'Cart',
			products: cartProducts
		});
	} catch (error) {
		console.log(error);
	}
};

exports.getOrders = async (req, res) => {
	try {
		const orders = await req.user.getOrders();

		res.render('shop/orders', {
			path: '/orders',
			pageTitle: 'Your Orders',
			orders: orders
		});
	} catch (error) {
		console.log(error);
	}
};

exports.postOrder = async (req, res) => {
	try {
		const order = await req.user.addOrder();
		console.log(order);

		res.redirect('/order');
	} catch (error) {
		console.log(error);
	}
};

exports.postCart = async (req, res) => {
	try {
		const prodId = req.body.productId.trim();
		const product = await Product.findBySerial(prodId);
		await req.user.addToCart(product);

		res.redirect('/products');
	} catch (error) {
		console.log(error);
	}
};

exports.postDeleteCartItem = async (req, res) => {
	try {
		const prodId = req.body.productId.trim();

		await req.user.deleteItemFromCart(prodId);

		res.redirect('/cart');
	} catch (error) {
		console.log(error);
	}
};
