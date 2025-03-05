const fs = require('fs');
const path = require('path');
const rootDir = path.dirname(require.main.filename);
const Cart = require('./cart');

const pathToJson = path.join(rootDir, 'data', 'products.json');

const getProductsFromFile = (calling) => {
	fs.readFile(pathToJson, (err, fileContent) => {
		if (err) {
			calling([]);
		} else {
			try {
				calling(JSON.parse(fileContent));
			} catch (e) {
				console.log(e);

				calling([]);
			}
		}
	});
};

module.exports = class Product {
	constructor(id, title, imageUrl, description, price) {
		this.id = id;
		this.title = title;
		this.imageUrl = imageUrl;
		this.description = description;
		this.price = price;
	}

	save() {
		getProductsFromFile((products) => {
			if (this.id) {
				const existingProductIndex = products.findIndex(
					(prod) => prod.id === this.id
				);
				console.log(existingProductIndex);

				// const updatedProducts = [...products];
				// updatedProducts[existingProductIndex] = this;
				products[existingProductIndex] = this;
				fs.writeFile(pathToJson, JSON.stringify(products), (err) => {
					console.log(err);
				});
			} else {
				this.id = Math.floor(Math.random() * 10000000)
					.toString()
					.trim();
				products.push(this);
				fs.writeFile(pathToJson, JSON.stringify(products), (err) => {
					console.log(err);
				});
			}
		});
	}

	// getPrice() {
	// 	return this.price;
	// }

	static fetchAll(calling) {
		getProductsFromFile(calling);
	}

	static findById(id, calling) {
		getProductsFromFile((products) => {
			const product = products.find((p) => p.id === id);

			calling(product);
		});
	}

	static deleteProduct(id) {
		getProductsFromFile((products) => {
			const productToBeDeleted = products.find((p) => p.id === id.trim());
			console.log(productToBeDeleted);

			Cart.deleteFromCart(id, productToBeDeleted.price);

			const updtatedProducts = products.filter((p) => p.id !== id);
			fs.writeFile(
				pathToJson,
				JSON.stringify(updtatedProducts),
				(err) => {
					console.log(err);
				}
			);
		});
	}
};
