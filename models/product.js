const pool = require('../util/database');

module.exports = class Product {
	constructor(id, title, imageUrl, description, price) {
		this.id = id;
		this.title = title;
		this.imageUrl = imageUrl;
		this.description = description;
		this.price = price;
	}

	async save() {
		try {
			const text =
				'INSERT INTO products (title, price, imageurl, description) VALUES ($1, $2, $3, $4)';
			const values = [
				this.title,
				this.price,
				this.imageUrl,
				this.description
			];
			return await pool.query(text, values);
		} catch (error) {
			console.log(error);
		}
	}

	static async fetchAll() {
		try {
			const text = 'SELECT * FROM products';
			return await pool.query(text);
		} catch (error) {
			console.log(error);
		}
	}

	static async findById(id) {
		try {
			const text = 'SELECT * FROM products WHERE id = $1';
			return await pool.query(text, [id]);
		} catch (error) {
			console.log(error);
		}
	}

	// static deleteProduct(id) {}
};
