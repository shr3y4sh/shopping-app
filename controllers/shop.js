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
	Cart.getCart((cart) => {
		Product.fetchAll((products) => {
			const cartProducts = [];

			for (let prod of cart.products) {
				const product = products.find((p) => p.id === prod.id);
				const quantity = prod.qty;
				cartProducts.push({ product: product, quantity: quantity });
			}

			res.render('shop/cart', {
				path: '/cart',
				pageTitle: 'Cart',
				products: cartProducts
			});
		});
	});
};

exports.postCart = (req, res) => {
	const productId = req.body.productId.trim();

	Product.findById(productId, (product) => {
		Cart.addProduct(productId, product.price);
	});

	res.redirect('/');
};

exports.postDeleteCartItem = (req, res) => {
	const prodId = req.body.productId.toString().trim();

	Product.findById(prodId, (prod) => {
		Cart.deleteFromCart(prodId, prod.price);
		res.redirect('/cart');
	});
};

exports.getCheckout = (req, res) => {
	res.render('shop/checkout', {
		path: '/checkout',
		pageTitle: 'Checkout'
	});
};
