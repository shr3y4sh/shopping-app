const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = async (req, res) => {
	const result = await Product.fetchAll();
	console.log(result);

	res.render('shop/product-list', {
		prods: result.rows,
		pageTitle: 'All Products',
		path: '/products'
	});
};

exports.getProduct = async (req, res) => {
	const prodId = req.params.productId;
	const result = await Product.findById(prodId.toString().trim());
	console.log(result);

	res.render('shop/product-detail', {
		product: result.rows[0],
		pageTitle: result.rows[0].title,
		path: '/products'
	});
};

exports.getIndex = async (req, res) => {
	const result = await Product.fetchAll();
	console.log(result);

	res.render('shop/index', {
		prods: result.rows,
		pageTitle: 'Shop',
		path: '/'
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
