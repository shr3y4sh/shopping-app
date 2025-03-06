const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const sequelize = require('./util/database');
const relations = require('./util/relations');

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
	const user = await User.findByPk(1);
	req.user = user;
	next();
});

app.use('/admin', adminRoutes);

app.use(shopRoutes);

app.use(errorRoute.get404);

relations();

(async function startServer() {
	try {
		await sequelize.sync();
		let user = await User.findByPk(1);
		let cart;

		if (!user) {
			user = await User.create({
				name: 'Max',
				email: 'test@test.com'
			});
			cart = await user.createCart();
		}

		cart = await user.getCart();

		console.log(cart);

		app.listen(port, () => {
			console.log(`Server running on port ${port}`);
		});
	} catch (err) {
		console.log(err);
	}
})();
