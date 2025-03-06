const Product = require('../models/product');

exports.getProducts = async (req, res) => {
	const result = await Product.findAll();

	res.render('shop/product-list', {
		prods: result,
		pageTitle: 'All Products',
		path: '/products'
	});
};

exports.getProduct = async (req, res) => {
	const prodId = req.params.productId;
	const result = await Product.findByPk(prodId);

	res.render('shop/product-detail', {
		product: result,
		pageTitle: result.title,
		path: '/products'
	});
};

exports.getIndex = async (req, res) => {
	const result = await Product.findAll();
	console.log(result);

	res.render('shop/index', {
		prods: result,
		pageTitle: 'Shop',
		path: '/'
	});
};

exports.getCart = async (req, res) => {
	const cart = await req.user.getCart();

	const cartProducts = await cart.getProducts();

	res.render('shop/cart', {
		path: '/cart',
		pageTitle: 'Cart',
		products: cartProducts
	});
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
	const prodId = req.body.productId.trim();

	const cart = await req.user.getCart();

	const products = await cart.getProducts({ where: { id: prodId } });

	let product;
	if (products.length > 0) {
		product = products[0];
	}
	let newQuantity = 1;

	if (!product) {
		product = await Product.findByPk(prodId);
	} else {
		const oldQuantity = product.cartItem.quantity;
		newQuantity = oldQuantity + 1;
	}

	await cart.addProduct(product, { through: { quantity: newQuantity } });

	res.redirect('/cart');
};

exports.postDeleteCartItem = async (req, res) => {
	const prodId = req.body.productId;

	const cart = await req.user.getCart();

	const [product] = await cart.getProducts({ where: { id: prodId } });
	console.log(product);

	await product.cartItem.destroy();

	res.redirect('/cart');
};
