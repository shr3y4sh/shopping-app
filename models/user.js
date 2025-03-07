const getDb = require('../util/database').getDb;
const { nanoid } = require('nanoid');

class User {
	constructor(username, email, serial) {
		this.username = username;
		this.email = email;
		this.userId = serial;
	}

	async save() {
		///
		try {
			const db = getDb();
			this.userId = nanoid();
			const result = await db.collection('users').insertOne(this);
			return result;
		} catch (err) {
			console.log(err);
		}
	}

	static async findUserById(serial) {
		try {
			const db = getDb();
			console.log(serial);

			const result = await db.collection('users').findOne({
				userId: serial
			});

			console.log(result);
			return result;
		} catch (error) {
			console.log(error);
		}
	}
}

module.exports = User;
