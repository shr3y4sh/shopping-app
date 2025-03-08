const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const session = require('express-session');
const mongoose = require('mongoose');
const mongoDBStore = require('connect-mongodb-session')(session);

const User = require('./models/user');

const shopRoutes = require('./routes/shop');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const errorRoute = require('./controllers/error');

(async function startApp() {
	try {
		const app = express();
		const port = 3000;

		const MONGODB_URI =
			'mongodb+srv://marshall:Sqnd1eS83jXaJqAQ@nodecluster.eh4s9.mongodb.net/shop?appName=nodeCluster';
		const clientOptions = {
			serverApi: { version: '1', strict: true, deprecationErrors: true }
		};
		const sessionStore = new mongoDBStore({
			uri: MONGODB_URI,
			collection: 'sessions'
		});

		app.set('view engine', 'ejs');
		app.set('views', 'views');

		app.use(bodyParser.urlencoded({ extended: false }));

		app.use(
			express.static(
				path.join(path.dirname(require.main.filename), 'public')
			)
		);

		app.use(
			session({
				secret: 'my secret string for the session',
				resave: false,
				saveUninitialized: false,
				store: sessionStore
			})
		);

		app.use(async (req, res, next) => {
			if (!req.session.userLoggedIn) {
				return next();
			}
			try {
				const user = await User.findById(req.session.userLoggedIn._id);

				req.user = user;

				next();
			} catch (error) {
				console.log(error);
			}
		});

		app.use('/admin', adminRoutes);

		app.use(shopRoutes);

		app.use(authRoutes);
		app.use(errorRoute.get404);

		await mongoose.connect(MONGODB_URI, clientOptions);
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
