const fs = require('fs');
const path = require('path');
const rootDir = path.dirname(require.main.filename);

const p = path.join(rootDir, 'data', 'cart.json');

module.exports = class Cart {
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

			cart.totalPrice += +prodPrice;

			fs.writeFile(p, JSON.stringify(cart), (err) => {
				console.log(err);
			});
		});
		//Analyse the cart => Find existing products
		//Add new product/ increase quantity
	}
};
