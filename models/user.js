const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	password: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	cart: {
		items: [
			{
				productId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Product',
					required: true
				},
				quantity: {
					type: Number,
					required: true
				}
			}
		]
	},

	resetToken: String,
	resetTokenExpiration: Date
});

userSchema.methods.clearCart = async function () {
	this.cart = { items: [] };
	return await this.save();
};

userSchema.methods.addToCart = async function (product) {
	try {
		const cartProductIndex = await this.cart.items.findIndex(
			(cp) => cp.productId.toString() === product._id.toString()
		);
		let newQuantity = 1;
		const updatedCartItems = [...this.cart.items];
		if (cartProductIndex >= 0) {
			newQuantity = this.cart.items[cartProductIndex].quantity + 1;
			updatedCartItems[cartProductIndex].quantity = newQuantity;
		} else {
			updatedCartItems.push({
				productId: product._id,
				quantity: newQuantity
			});
		}
		const updatedCart = {
			items: updatedCartItems
		};
		this.cart = updatedCart;
		return await this.save();
	} catch (error) {
		console.log(error);
	}
};

userSchema.methods.removeFromCart = async function (productId) {
	try {
		const updatedCartItems = this.cart.items.filter(
			(item) => item.productId.toString() !== productId.toString()
		);

		this.cart.items = updatedCartItems;

		return await this.save();
	} catch (error) {
		console.log(error);
	}
};

module.exports = mongoose.model('User', userSchema);

/*
class User {
	constructor(username, email, serial, cart) {
		this.username = username;
		this.email = email;
		this.userId = serial;
		this.cart = cart; // { items: [] }
	}

	async save() {
		///
		try {
			const db = getDb();
			this.userId = nanoid();
			const result = await db.collection('users').insertOne(this);
			return result;
		} catch (error) {
			console.log(error);
		}
	}

	async addToCart(product) {
		
	}

	async getCart() {
		try {
			const db = getDb();
			const productIds = this.cart.items.map((i) => i.productId);
			const products = await db
				.collection('products')
				.find({ serial: { $in: productIds } })
				.toArray();

			return products.map((p) => {
				return {
					...p,
					quantity: this.cart.items.find(
						(i) => i.productId === p.serial
					).quantity
				};
			});
		} catch (error) {
			console.log(error);
		}
	}

	async deleteItemFromCart(productId) {
		try {
			const updatedCartItems = this.cart.items.filter(
				(item) => item.productId !== productId
			);

			const db = getDb();
			return await db.collection('users').updateOne(
				{
					userId: this.userId
				},
				{
					$set: { cart: { items: updatedCartItems } }
				}
			);
		} catch (error) {
			console.log(error);
		}
	}

	async getOrders() {
		try {
			const db = getDb();
			const result = await db
				.collection('orders')
				.find({ 'user.userId': this.userId })
				.toArray();
			return result;
		} catch (error) {
			console.log(error);
		}
	}

	async addOrder() {
		try {
			console.log(this);

			const db = getDb();
			const products = await this.getCart();
			const order = {
				items: products,
				user: {
					username: this.username,
					userId: this.userId
				}
			};

			await db.collection('orders').insertOne(order);
			this.cart = { items: [] };
			await db.collection('users').updateOne(
				{
					userId: this.userId
				},
				{
					$set: { cart: { items: [] } }
				}
			);
			return order;
		} catch (error) {
			console.log(error);
		}
	}

	static async findUserById(serial) {
		try {
			const db = getDb();

			const result = await db.collection('users').findOne({
				userId: serial
			});

			return result;
		} catch (error) {
			console.log(error);
		}
	}
}
*/
