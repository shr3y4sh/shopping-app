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
	const orders = await req.user.getOrders({ include: ['products'] });

	console.log(orders);

	res.render('shop/orders', {
		path: '/orders',
		pageTitle: 'Your Orders',
		orders: orders
	});
};

exports.postOrder = async (req, res) => {
	const cart = await req.user.getCart();
	let products = await cart.getProducts();
	console.log(products);

	const order = await req.user.createOrder();
	products = products.map((product) => {
		product.OrderItem = {
			quantity: product.cartItem.quantity
		};
		return product;
	});
	await order.addProducts(products);

	await cart.setProducts(null);

	res.redirect('/order');
};

exports.postCart = async (req, res) => {
	try {
		const prodId = req.body.productId.trim();
		const product = await Product.findBySerial(prodId);
		const result = await req.user.addToCart(product);
		console.log(result);

		res.redirect('/cart');
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
