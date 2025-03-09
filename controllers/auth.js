const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.getLogin = async (req, res) => {
	try {
		let message = req.flash('error');
		console.log(message);

		await res.render('auth/login', {
			path: '/login',
			pageTitle: 'Login',
			errorMessage: message[0]
		});
	} catch (error) {
		console.log(error);
	}
};

exports.getSignup = async (req, res) => {
	try {
		let message = req.flash('email_invalid');
		console.log(message);
		await res.render('auth/signup', {
			path: '/signup',
			pageTitle: 'Signup',
			errorMessage: message[0]
		});
	} catch (error) {
		console.log(error);
	}
};

exports.postLogin = async (req, res) => {
	try {
		const email = req.body.email;
		const password = req.body.password;

		const user = await User.findOne({ email: email });

		if (!user) {
			req.flash('error', 'Invalid email or password.');
			return await res.redirect('/login');
		}

		const isMatched = await bcrypt.compare(password, user.password);

		if (!isMatched) {
			req.flash('error', 'Invalid email or password.');
			return await res.redirect('/login');
		}
		req.session.userLoggedIn = user;

		req.session.isAuthenticated = true;
		req.session.save();
		return await res.redirect('/');
	} catch (error) {
		console.log(error);
	}
};

exports.postSignup = async (req, res) => {
	try {
		const email = req.body.email;
		const password = req.body.password;
		// const confirmpassword = req.body.confirmpassword;

		let user = await User.findOne({ email: email });

		if (user) {
			req.flash(
				'email_invalid',
				'Email already exists, please choose a different one.'
			);
			return await res.redirect('/signup');
		}

		const hash = await bcrypt.hash(password, 12);

		user = new User({
			email: email,
			password: hash,
			cart: { items: [] }
		});

		await user.save();
		await res.redirect('/login');
	} catch (error) {
		console.log(error);
	}
};

exports.postLogout = async (req, res) => {
	try {
		req.session.destroy();
		await res.redirect('/');
	} catch (error) {
		console.log(error);
	}
};
