const getDb = require('../util/database').getDb;

const serialList = [];

async function createSerial() {
	while (true) {
		const number = Math.floor(Math.random() * 10000000).toString(16);
		if (serialList.indexOf(number) === -1) {
			serialList.push(number);
			return number;
		}
	}
}

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
				this.serial = await createSerial();
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
			console.log(serial);

			const result = await db
				.collection('products')
				.find({
					serial: serial
				})
				.next();

			console.log(result);
			return result;
		} catch (error) {
			console.log(error);
		}
	}
}

module.exports = Product;

// 67ca8b6ff64da3bd280e8501
