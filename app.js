const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const mongoose = require('mongoose');
const mongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const cookie = require('cookie-parser');
const flash = require('express-flash');
const multer = require('multer');

require('dotenv').config();

const { env } = require('process');

const User = require('./models/user');

const shopRoutes = require('./routes/shop');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const errorRoute = require('./controllers/error');

const fileStorage = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, 'images');
	},
	filename: (req, file, callback) => {
		callback(null, new Date().toISOString() + '-' + file.originalname);
	}
});

const fileFilter = (req, file, callback) => {
	if (
		file.mimetype === 'image/png' ||
		file.mimetype === 'image/jpg' ||
		file.mimetype === 'image/jpeg' ||
		file.mimetype === 'image/avif'
	) {
		callback(null, true);
	} else {
		callback(null, false);
	}
};

const app = express();
const PORT = 3000;

const clientOptions = {
	serverApi: { version: '1', strict: true, deprecationErrors: true }
};
const sessionStore = new mongoDBStore({
	uri: env.MONGODB_URI,
	collection: 'sessions'
});

(async function startApp() {
	try {
		const csrfProtection = csrf();

		// Using Embedded Javascript as template engine
		app.set('view engine', 'ejs');
		app.set('views', 'views');

		// To read the req.body elements
		app.use(bodyParser.urlencoded({ extended: false }));

		// To get file uploads
		app.use(
			multer({ storage: fileStorage, fileFilter: fileFilter }).single(
				'image'
			)
		);

		// To use static files like css or images
		app.use(
			express.static(
				path.join(path.dirname(require.main.filename), 'public')
			)
		);
		app.use(
			'/images',
			express.static(
				path.join(path.dirname(require.main.filename), 'images')
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

		// Authenticating csrf token
		app.use((req, res, next) => {
			res.locals.isAuthenticated = req.session.isAuthenticated;
			res.locals.csrfToken = req.csrfToken();
			next();
		});

		// using sessions to persist user login
		app.use(async (req, res, next) => {
			try {
				if (!req.session.userLoggedIn) {
					return next();
				}
				const user = await User.findById(req.session.userLoggedIn._id);

				if (!user) {
					return next();
				}
				req.user = user;

				next();
			} catch (error) {
				const err = new Error(error);
				err.httpStatusCode = 500;
				return next(err);
			}
		});

		// website routes
		app.use('/admin', adminRoutes);
		app.use(shopRoutes);
		app.use(authRoutes);

		app.use(errorRoute.get404);

		app.use(async (error, req, res, next) => {
			try {
				console.log(error);

				return errorRoute.get500(req, res, next);
			} catch (error) {
				next(error);
			}
		});

		// connection to mongodb
		await mongoose.connect(env.MONGODB_URI, clientOptions);
		await mongoose.connection.db.admin().command({ ping: 1 });
		console.log('You successfully connected to MongoDB!');

		// connect to server localhost:3000
		app.listen(PORT, () => {
			console.log(`Server running on PORT ${PORT}`);
		});
	} catch (err) {
		console.log(err);
	}
})();
