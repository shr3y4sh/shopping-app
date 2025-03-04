const { log } = require('console');
const fs = require('fs');
const path = require('path');
const rootDir = path.dirname(require.main.filename);

const p = path.join(rootDir, 'data', 'cart.json');

module.exports = class Cart {
	static addProduct(prodId, prodPrice) {
		//Fetch the previous cart

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
			// console.log('HERE');

			const existingProductIndex = cart.products.findIndex((prod) => {
				console.log('Here');

				prod.id === prodId;
			});
			const existingProduct = cart.products[existingProductIndex];

			let updatedProduct;

			if (existingProduct) {
				updatedProduct = { ...existingProduct };
				updatedProduct.qty += 1;
				// cart.products = [...cart.products];
				cart.products[existingProductIndex] = updatedProduct;
			} else {
				updatedProduct = { id: prodId, qty: 1 };
				cart.products = [...cart.products, updatedProduct];
			}

			cart.totalPrice += +prodPrice;

			fs.writeFile(p, JSON.stringify(cart), (err) => {
				log(err);
			});
		});
		//Analyse the cart => Find existing products
		//Add new product/ increase quantity
	}
};
