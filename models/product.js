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
	constructor(title, price, imageurl, description) {
		this.title = title;
		this.price = price;
		this.imageurl = imageurl;
		this.description = description;
	}

	async save() {
		try {
			this.serial = await createSerial();
			const db = getDb();
			const result = await db.collection('products').insertOne(this);
			console.log(result);
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

	static async findBySerial(prodId) {
		try {
			const db = getDb();
			console.log(prodId);

			const result = await db
				.collection('products')
				.find({
					serial: prodId
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
