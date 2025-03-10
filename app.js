const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const mongoose = require('mongoose');
const mongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const cookie = require('cookie-parser');
const flash = require('express-flash');

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

		const csrfProtection = csrf();

		// Using Embedded Javascript as template engine
		app.set('view engine', 'ejs');
		app.set('views', 'views');

		// To read the req.body elements
		app.use(bodyParser.urlencoded({ extended: false }));

		// To use static files like css or images
		app.use(
			express.static(
				path.join(path.dirname(require.main.filename), 'public')
			)
		);

		// Cookie parser
		app.use(cookie());

		// Session setting
		app.use(
			session({
				secret: 'my secret string for the session',
				resave: false,
				saveUninitialized: false,
				store: sessionStore
			})
		);

		// CSRF Protection middleware
		app.use(csrfProtection);
		app.use(flash());

		// using sessions to persist user login
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

		// Authenticating csrf token
		app.use((req, res, next) => {
			res.locals.isAuthenticated = req.session.isAuthenticated;
			res.locals.csrfToken = req.csrfToken();
			next();
		});

		// website routes
		app.use('/admin', adminRoutes);
		app.use(shopRoutes);
		app.use(authRoutes);
		app.use(errorRoute.get404);

		// connection to mongodb
		await mongoose.connect(MONGODB_URI, clientOptions);
		await mongoose.connection.db.admin().command({ ping: 1 });
		console.log('You successfully connected to MongoDB!');

		// connect to server localhost:3000
		app.listen(port, () => {
			console.log(`Server running on port ${port}`);
		});
	} catch (err) {
		console.log(err);
	}
})();
