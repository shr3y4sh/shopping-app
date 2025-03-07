const { nanoid } = require('nanoid');

const getDb = require('../util/database').getDb;

class Product {
	constructor(title, price, imageurl, description, serial) {
		this.title = title;
		this.price = price;
		this.imageurl = imageurl;
		this.description = description;
		this.serial = serial;
	}

	async save() {
		try {
			const db = getDb();
			let result;
			if (this.serial) {
				result = await db.collection('products').updateOne(
					{
						serial: this.serial
					},
					{
						$set: this
					}
				);
			} else {
				this.serial = nanoid();
				result = await db.collection('products').insertOne(this);
			}
			return result;
		} catch (err) {
			console.log(err);
		}
	}

	static async fetchAll() {
		try {
			const db = getDb();
			const result = await db.collection('products').find().toArray();
			return result;
		} catch (error) {
			console.log(error);
		}
	}

	static async deleteBySerial(serial) {
		try {
			const db = getDb();
			const result = await db.collection('products').deleteOne({
				serial: serial
			});
			return result;
		} catch (error) {
			console.log(error);
		}
	}

	static async findBySerial(serial) {
		try {
			const db = getDb();

			const result = await db
				.collection('products')
				.find({
					serial: serial
				})
				.next();

			return result;
		} catch (error) {
			console.log(error);
		}
	}
}

module.exports = Product;
