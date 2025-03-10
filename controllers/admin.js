const Product = require('../models/product');

exports.getAddProduct = async (req, res) => {
	await res.render('admin/edit-product', {
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

	const product = new Product({
		title: title,
		price: price,
		imageurl: imageUrl,
		description: description,
		userId: req.user
	});
	try {
		await product.save();

		await res.redirect('/');
	} catch (error) {
		console.log(error);
	}
};

exports.getProducts = async (req, res) => {
	try {
		// { userId: req.user._id }
		const products = await Product.find({ userId: req.user._id });
		await res.render('admin/products', {
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

		const product = await Product.findById(prodId);

		if (!product) {
			return res.redirect('/');
		}

		await res.render('admin/edit-product', {
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
	const prodId = req.body.productId;

	const product = await Product.findById(prodId);

	if (product.userId.toString() !== req.user._id.toString()) {
		return await res.redirect('/');
	}
	product.title = req.body.title;
	product.price = req.body.price;
	product.imageurl = req.body.imageUrl;
	product.description = req.body.description;

	await product.save();

	await res.redirect('/admin/products');
};

exports.postDeleteProduct = async (req, res) => {
	try {
		const prodId = req.body.productId;
		await Product.findOneAndDelete({ _id: prodId, userId: req.user._id });

		await res.redirect('/admin/products');
	} catch (error) {
		console.log(error);
	}
};

/* 
http://localhost:3000/admin/edit-product/2123989?edit=true
*/
