const pdfHelper = require('../util/pdf-create');

const Product = require('../models/product');

const Order = require('../models/order');

const ITEMS_PER_PAGE = 2;

exports.getProducts = async (req, res, next) => {
	try {
		let page = +req.query.page || 1;

		const numProducts = await Product.find().countDocuments();

		const result = await Product.find()
			.skip((page - 1) * ITEMS_PER_PAGE)
			.limit(ITEMS_PER_PAGE);

		await res.render('shop/product-list', {
			prods: result,
			pageTitle: 'All Products',
			path: '/products',
			currentPage: page,
			hasNextPage: ITEMS_PER_PAGE * page < numProducts,
			hasPreviousPage: page > 1,
			nextPage: page + 1,
			previousPage: page - 1,
			lastPage: Math.ceil(numProducts / ITEMS_PER_PAGE)
		});
	} catch (error) {
		const err = new Error(error);
		err.httpStatusCode = 500;
		return next(err);
	}
};

exports.getProduct = async (req, res, next) => {
	try {
		const prodId = req.params.productId.trim();
		const result = await Product.findById(prodId);

		await res.render('shop/product-detail', {
			product: result,
			pageTitle: result.title,
			path: '/products'
		});
	} catch (error) {
		const err = new Error(error);
		err.httpStatusCode = 500;
		return next(err);
	}
};

exports.getIndex = async (req, res, next) => {
	try {
		let page = +req.query.page || 1;

		const numProducts = await Product.find().countDocuments();

		const result = await Product.find()
			.skip((page - 1) * ITEMS_PER_PAGE)
			.limit(ITEMS_PER_PAGE);

		await res.render('shop/index', {
			prods: result,
			pageTitle: 'Shop',
			path: '/',
			currentPage: page,
			hasNextPage: ITEMS_PER_PAGE * page < numProducts,
			hasPreviousPage: page > 1,
			nextPage: page + 1,
			previousPage: page - 1,
			lastPage: Math.ceil(numProducts / ITEMS_PER_PAGE)
		});
	} catch (error) {
		const err = new Error(error);
		err.httpStatusCode = 500;

		return next(err);
	}
};

exports.getCart = async (req, res, next) => {
	try {
		const user = await req.user.populate('cart.items.productId');
		const products = user.cart.items;
		await res.render('shop/cart', {
			path: '/cart',
			pageTitle: 'Cart',
			products: products
		});
	} catch (error) {
		const err = new Error(error);
		err.httpStatusCode = 500;
		return next(err);
	}
};

exports.getOrders = async (req, res, next) => {
	try {
		const orders = await Order.find({
			'user.userId': req.user._id
		});

		await res.render('shop/orders', {
			path: '/orders',
			pageTitle: 'Your Orders',
			orders: orders
		});
	} catch (error) {
		const err = new Error(error);
		err.httpStatusCode = 500;
		return next(err);
	}
};

exports.postOrder = async (req, res, next) => {
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
				email: req.user.email,
				userId: req.user
			},
			products: products
		});
		await order.save();
		req.user.clearCart();
		await res.redirect('/orders');
	} catch (error) {
		const err = new Error(error);
		err.httpStatusCode = 500;
		return next(err);
	}
};

exports.postCart = async (req, res, next) => {
	try {
		const prodId = req.body.productId.trim();
		const product = await Product.findById(prodId);
		const user = req.user.addToCart(product);
		console.log(user);
		await res.redirect('/products');
	} catch (error) {
		const err = new Error(error);
		err.httpStatusCode = 500;
		return next(err);
	}
};

exports.postDeleteCartItem = async (req, res, next) => {
	try {
		const prodId = req.body.productId.trim();

		req.user.removeFromCart(prodId);

		await res.redirect('/cart');
	} catch (error) {
		const err = new Error(error);
		err.httpStatusCode = 500;
		return next(err);
	}
};

exports.getInvoice = async (req, res, next) => {
	try {
		const orderId = req.params.orderId;

		const order = await Order.findById(orderId);

		if (!order) {
			return next(new Error('No order found'));
		}

		if (order.user.userId.toString() !== req.user._id.toString()) {
			return next(new Error('Unauthorized'));
		}

		pdfHelper(order, res);
	} catch (error) {
		const err = new Error(error);
		err.httpStatusCode = 500;
		return next(err);
	}
};
