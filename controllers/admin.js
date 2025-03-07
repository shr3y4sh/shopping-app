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

/*

exports.postEditProduct = async (req, res) => {
	const prodId = req.body.productId.trim();
	const updatedTitle = req.body.title;
	const updatedPrice = req.body.price;
	const updatedImageUrl = req.body.imageUrl;
	const updatedDescription = req.body.description;

	const product = await Product.findByPk(prodId);
	product.title = updatedTitle;
	product.price = updatedPrice;
	product.imageurl = updatedImageUrl;
	product.description = updatedDescription;

	await product.save();

	res.redirect('/admin/products');
};

exports.getProducts = async (req, res) => {
	const products = await req.user.getProducts();
	res.render('admin/products', {
		prods: products,
		pageTitle: 'Admin Products',
		path: '/admin/products'
	});
};

exports.getEditProduct = async (req, res) => {
	const editMode = Boolean(req.query.edit);

	if (!editMode) {
		return res.redirect('/');
	}

	const prodId = req.params.productId.trim();

	const product = await req.user.getProducts({
		where: {
			id: prodId
		}
	});

	if (!product) {
		return res.redirect('/');
	}

	res.render('admin/edit-product', {
		pageTitle: 'Edit Product',
		path: '/admin/edit-product',
		editing: true,
		product: product[0]
	});
};

exports.postDeleteProduct = async (req, res) => {
	const prodId = req.body.productId;
	const product = await Product.findByPk(prodId);
	await product.destroy();
	res.redirect('/admin/products');
};

/* 
http://localhost:3000/admin/edit-product/2123989?edit=true
*/
