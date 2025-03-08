const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const mongoConnect = require('./util/database').mongoConnect;

const User = require('./models/user');

const shopRoutes = require('./routes/shop');
const adminRoutes = require('./routes/admin');
const errorRoute = require('./controllers/error');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(
	express.static(path.join(path.dirname(require.main.filename), 'public'))
);

app.use(async (req, res, next) => {
	try {
		const user = await User.findUserById('qOvaHOI7cc0fOZgcgewGA');
		req.user = new User(user.username, user.email, user.userId, user.cart);
		next();
	} catch (error) {
		console.log(error);
	}
});

app.use('/admin', adminRoutes);

app.use(shopRoutes);

app.use(errorRoute.get404);

(async function startServer() {
	try {
		await mongoConnect(() => {
			console.log('MongoDB connected');

			app.listen(port, () => {
				console.log(`Server running on port ${port}`);
			});
		});
	} catch (err) {
		console.log(err);
	}
})();

// await sequelize.sync();
// let user = await User.findByPk(1);
// let cart;

// if (!user) {
// 	user = await User.create({
// 		name: 'Max',
// 		email: 'test@test.com'
// 	});
// 	cart = await user.createCart();
// }

// cart = await user.getCart();

// console.log(cart);
