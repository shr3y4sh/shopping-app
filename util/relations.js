const Product = require('../models/product');
const User = require('../models/user');
const Cart = require('../models/cart');
const CartItem = require('../models/cart-item');
const Order = require('../models/order');
const OrderItem = require('../models/order-item');

module.exports = function () {
	Product.belongsTo(User, {
		constraints: true,
		onDelete: 'CASCADE'
	});
	User.hasMany(Product);
	User.hasOne(Cart);
	Cart.belongsTo(User);
	Cart.belongsToMany(Product, { through: CartItem });
	Product.belongsToMany(Cart, { through: CartItem });
	Order.belongsTo(User);
	User.hasMany(Order);
	Order.belongsToMany(Product, { through: OrderItem });
};
