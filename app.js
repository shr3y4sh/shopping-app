const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const mongoose = require('mongoose');

const User = require('./models/user');

const shopRoutes = require('./routes/shop');
const adminRoutes = require('./routes/admin');
const errorRoute = require('./controllers/error');

(async function startApp() {
	try {
		const app = express();
		const port = 3000;
		const uri =
			'mongodb+srv://marshall:Sqnd1eS83jXaJqAQ@nodecluster.eh4s9.mongodb.net/shop?retryWrites=true&w=majority&appName=nodeCluster';
		const clientOptions = {
			serverApi: { version: '1', strict: true, deprecationErrors: true }
		};
		app.set('view engine', 'ejs');
		app.set('views', 'views');

		app.use(bodyParser.urlencoded({ extended: false }));

		app.use(
			express.static(
				path.join(path.dirname(require.main.filename), 'public')
			)
		);

		app.use(async (req, res, next) => {
			try {
				let user = await User.findById('67cc0fa71bf4a445811a8eef');
				req.user = user;
				next();
			} catch (error) {
				console.log(error);
			}
		});

		app.use('/admin', adminRoutes);

		app.use(shopRoutes);

		app.use(errorRoute.get404);

		await mongoose.connect(uri, clientOptions);
		await mongoose.connection.db.admin().command({ ping: 1 });
		console.log('You successfully connected to MongoDB!');

		let user = await User.findOne();

		if (!user) {
			user = new User({
				username: 'Alice',
				email: 'alice@alpha.com',
				cart: {
					items: []
				}
			});
		}
		user.save();
		app.listen(port, () => {
			console.log(`Server running on port ${port}`);
		});
	} catch (err) {
		console.log(err);
	}
})();
