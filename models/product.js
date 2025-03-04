const fs = require('fs');
const path = require('path');
const rootDir = path.dirname(require.main.filename);

const pathToJson = path.join(rootDir, 'data', 'products.json');

const getProductsFromFile = (calling) => {
	fs.readFile(pathToJson, (err, fileContent) => {
		if (err) {
			calling([]);
		} else {
			try {
				calling(JSON.parse(fileContent));
				console.log('file reading success');
			} catch (e) {
				console.log(e);

				calling([]);
			}
		}
	});
};

module.exports = class Product {
	constructor(title, imageUrl, description, price) {
		this.title = title;
		this.imageUrl = imageUrl;
		this.description = description;
		this.price = price;
	}

	save() {
		this.id = Math.floor(Math.random() * 10000000)
			.toString()
			.trim();
		getProductsFromFile((products) => {
			products.push(this);
			fs.writeFile(pathToJson, JSON.stringify(products), (err) => {
				console.log(err);
			});
		});
	}

	getPrice() {
		return this.price;
	}

	static fetchAll(calling) {
		console.log('fetchAll');

		getProductsFromFile(calling);
	}

	static findById(id, calling) {
		// console.log('findById function in product class');

		getProductsFromFile((products) => {
			const product = products.find((p) => p.id.trim() === id.trim());

			calling(product);
		});
	}
};
