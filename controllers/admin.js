// const { post } = require("../routes/shop");
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

	const product = new Product(null, title, imageUrl, description, price);
	await product.save();
	res.redirect('/');
};

exports.postEditProduct = (req, res) => {
	const prodId = req.body.productId.trim();
	const updatedTitle = req.body.title;
	const updatedPrice = req.body.price;
	const updatedImageUrl = req.body.imageUrl;
	const updatedDescription = req.body.description;
	const updatedProduct = new Product(
		prodId,
		updatedTitle,
		updatedImageUrl,
		updatedDescription,
		updatedPrice
	);
	console.log(updatedProduct);

	updatedProduct.save();
	res.redirect('/admin/products');
};

exports.getProducts = (req, res) => {
	Product.fetchAll((products) => {
		res.render('admin/products', {
			prods: products,
			pageTitle: 'Admin Products',
			path: '/admin/products'
		});
	});
};

exports.getEditProduct = (req, res) => {
	const editMode = Boolean(req.query.edit);

	if (!editMode) {
		return res.redirect('/');
	}

	const prodId = req.params.productId.trim();

	Product.findById(prodId, (product) => {
		if (!product) {
			return res.redirect('/');
		}

		res.render('admin/edit-product', {
			pageTitle: 'Edit Product',
			path: '/admin/edit-product',
			editing: true,
			product: product
		});
	});
};

exports.postDeleteProduct = (req, res) => {
	const prodId = req.body.productId;
	Product.deleteProduct(prodId);
	res.redirect('/admin/products');
};

/* 
http://localhost:3000/admin/edit-product/2123989?edit=true
*/
