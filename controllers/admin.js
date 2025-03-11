const Product = require('../models/product');
const { validationResult } = require('express-validator');

exports.getAddProduct = async (req, res) => {
	await res.render('admin/edit-product', {
		pageTitle: 'Add Product',
		path: '/admin/add-product',
		editing: false,
		hasError: false,
		errorMessage: '',
		oldMessage: {
			title: '',
			imageurl: '',
			price: '',
			description: ''
		},
		validation: []
	});
};

exports.postAddProduct = async (req, res) => {
	try {
		const title = req.body.title;
		const imageurl = req.body.imageUrl;
		const price = req.body.price;
		const description = req.body.description;

		const validationErrors = validationResult(req);
		if (!validationErrors.isEmpty()) {
			return await res.status(422).render('admin/edit-product', {
				path: '/admin/add-product',
				pageTitle: 'Add Product',
				editing: false,
				hasError: true,
				errorMessage: validationErrors.array()[0].msg,
				oldMessage: {
					title: title,
					imageurl: imageurl,
					price: price,
					description: description
				},
				validation: validationErrors.array()
			});
		}

		const product = new Product({
			title: title,
			price: price,
			imageurl: imageurl,
			description: description,
			userId: req.user
		});

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

exports.getEditProduct = async (req, res, next) => {
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
		const title = product.title;
		const imageurl = product.imageurl;
		const price = product.price;
		const description = product.description;

		await res.render('admin/edit-product', {
			pageTitle: 'Edit Product',
			path: '/admin/edit-product',
			product: product,
			editing: true,
			hasError: false,
			errorMessage: '',
			oldMessage: {
				title: title,
				imageurl: imageurl,
				price: price,
				description: description
			},
			validation: []
		});
	} catch (error) {
		const err = new Error(error);
		err.httpStatusCode = 500;
		return next(err);
	}
};

exports.postEditProduct = async (req, res, next) => {
	try {
		const prodId = req.body.productId;
		const title = req.body.title;
		const price = req.body.price;
		const imageurl = req.body.imageUrl;
		const description = req.body.description;

		const product = await Product.findById(prodId);

		if (product.userId.toString() !== req.user._id.toString()) {
			return await res.redirect('/');
		}

		const validationErrors = validationResult(req);
		console.log(validationErrors);

		if (!validationErrors.isEmpty()) {
			return await res.status(422).render('admin/edit-product', {
				path: '/admin/add-product',
				pageTitle: 'Add Product',
				product: product,
				editing: true,
				hasError: true,
				errorMessage: validationErrors.array()[0].msg,
				oldMessage: {
					title: title,
					imageurl: imageurl,
					price: price,
					description: description
				},
				validation: validationErrors.array()
			});
		}

		product.title = title;
		product.price = price;
		product.imageurl = imageurl;
		product.description = description;

		await product.save();

		await res.redirect('/admin/products');
	} catch (error) {
		const err = new Error(error);
		err.httpStatusCode = 500;
		return next(err);
	}
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
