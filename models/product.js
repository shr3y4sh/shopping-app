const fs = require('fs');
const path = require('path');
const rootDir = path.dirname(require.main.filename);

const pathToJson = path.join(rootDir, 'data', 'products.json');

const getProductsFromFile = (callback) => {
	fs.readFile(pathToJson, (err, fileContent) => {
		if (!err) {
			callback(JSON.parse(fileContent));
		} else {
			callback([]);
		}
	});
};

class Product {
	constructor(title, imageUrl, description, price) {
		this.title = title;
		this.imageUrl = imageUrl;
		this.description = description;
		this.price = price;
	}

	save() {
		getProductsFromFile((products) => {
			products.push(this);
			fs.writeFile(pathToJson, JSON.stringify(products), (err) => {
				console.log(err);
			});
		});
	}

	static fetchAll(callback) {
		getProductsFromFile(callback);
	}
}

module.exports = Product;
