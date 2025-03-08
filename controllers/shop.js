const Product = require('../models/product');

const Order = require('../models/order');

exports.getProducts = async (req, res) => {
	try {
		const result = await Product.find();

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
		const prodId = req.params.productId.trim();
		const result = await Product.findById(prodId);

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
		const result = await Product.find();
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
		const user = await req.user.populate('cart.items.productId');
		const products = user.cart.items;
		res.render('shop/cart', {
			path: '/cart',
			pageTitle: 'Cart',
			products: products
		});
	} catch (error) {
		console.log(error);
	}
};

exports.getOrders = async (req, res) => {
	try {
		const orders = await Order.find({ 'user.userId': req.user._id });

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
		const user = await req.user.populate('cart.items.productId');
		const products = await user.cart.items.map((i) => {
			return {
				quantity: i.quantity,
				productData: { ...i.productId._doc }
			};
		});
		const order = new Order({
			user: {
				username: req.user.username,
				userId: req.user
			},
			products: products
		});
		await order.save();
		await req.user.clearCart();
		res.redirect('/orders');
	} catch (error) {
		console.log(error);
	}
};

exports.postCart = async (req, res) => {
	try {
		const prodId = req.body.productId.trim();
		const product = await Product.findById(prodId);
		const user = await req.user.addToCart(product);
		console.log(user);
		res.redirect('/products');
	} catch (error) {
		console.log(error);
	}
};

exports.postDeleteCartItem = async (req, res) => {
	try {
		const prodId = req.body.productId.trim();

		await req.user.removeFromCart(prodId);

		res.redirect('/cart');
	} catch (error) {
		console.log(error);
	}
};
