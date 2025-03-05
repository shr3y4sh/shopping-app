const fs = require('fs');
const path = require('path');
const rootDir = path.dirname(require.main.filename);

const p = path.join(rootDir, 'data', 'cart.json');

module.exports = class Cart {
	static getCart(callback) {
		fs.readFile(p, (err, content) => {
			if (!err) {
				callback(JSON.parse(content));
			} else {
				callback([]);
			}
		});
	}

	static addProduct(prodId, prodPrice) {
		//Fetch the previous cart
		prodId = prodId.trim();
		fs.readFile(p, (err, content) => {
			let cart;
			if (!err) {
				cart = JSON.parse(content);
			} else {
				cart = {
					products: [],
					totalPrice: 0
				};
			}

			const existingProductIndex = cart.products.findIndex(
				(prod) => prod.id === prodId
			);
			const existingProduct = cart.products[existingProductIndex];

			let updatedProduct;

			if (existingProduct) {
				updatedProduct = { ...existingProduct };
				updatedProduct.qty += 1;
				cart.products = [...cart.products];
				cart.products[existingProductIndex] = updatedProduct;
			} else {
				updatedProduct = { id: prodId, qty: 1 };
				cart.products = [...cart.products, updatedProduct];
			}

			cart.totalPrice += Number(prodPrice);

			fs.writeFile(p, JSON.stringify(cart), (err) => {
				console.log(err);
			});
		});
		//Analyse the cart => Find existing products
		//Add new product/ increase quantity
	}

	static deleteFromCart(id, price) {
		fs.readFile(p, (err, content) => {
			if (err) {
				return;
			}

			const cart = { ...JSON.parse(content) };

			const product = cart.products.find((p) => p.id === id);

			if (!product) {
				return;
			}

			cart.products = cart.products.filter((p) => p.id !== id);
			cart.totalPrice -= Number(price) * product.qty;

			fs.writeFile(p, JSON.stringify(cart), (err) => {
				console.log(err);
			});
		});
	}
};
