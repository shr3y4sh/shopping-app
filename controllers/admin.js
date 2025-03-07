const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
	res.render('admin/edit-product', {
		pageTitle: 'Add Product',
		path: '/admin/add-product',
		editing: false
	});
};

exports.postAddProduct = async (req, res) => {
	const title = req.body.title;
	const imageUrl = req.body.imageUrl;
	const price = req.body.price;
	const description = req.body.description;

	const product = new Product(title, price, imageUrl, description);
	try {
		const result = await product.save();
		console.log(result);
		res.redirect('/');
	} catch (err) {
		console.log(err);
	}
};

exports.getProducts = async (req, res) => {
	try {
		const products = await Product.fetchAll();
		res.render('admin/products', {
			prods: products,
			pageTitle: 'Admin Products',
			path: '/admin/products'
		});
	} catch (error) {
		console.log(error);
	}
};

exports.getEditProduct = async (req, res) => {
	try {
		const editMode = Boolean(req.query.edit);

		if (!editMode) {
			return res.redirect('/');
		}

		const prodId = req.params.productId;

		const product = await Product.findBySerial(prodId);

		if (!product) {
			return res.redirect('/');
		}

		res.render('admin/edit-product', {
			pageTitle: 'Edit Product',
			path: '/admin/edit-product',
			editing: true,
			product: product
		});
	} catch (error) {
		console.log(error);
	}
};

exports.postEditProduct = async (req, res) => {
	const updatedTitle = req.body.title;
	const updatedPrice = req.body.price;
	const updatedImageUrl = req.body.imageUrl;
	const updatedDescription = req.body.description;
	const serial = req.body.productId;
	const product = new Product(
		updatedTitle,
		updatedPrice,
		updatedImageUrl,
		updatedDescription,
		serial
	);

	await product.save();

	res.redirect('/admin/products');
};

exports.postDeleteProduct = async (req, res) => {
	try {
		const serial = req.body.productId;
		const result = await Product.deleteBySerial(serial);
		console.log(result);

		res.redirect('/admin/products');
	} catch (error) {
		console.log(error);
	}
};

/* 
http://localhost:3000/admin/edit-product/2123989?edit=true
*/
