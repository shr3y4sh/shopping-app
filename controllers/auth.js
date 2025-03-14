const bcrypt = require('bcryptjs');
const sgMail = require('@sendgrid/mail');
const { validationResult } = require('express-validator');

const { env } = require('process');

const { nanoid } = require('nanoid');

const User = require('../models/user');

sgMail.setApiKey(env.SEND_GRID_APIKEY);

exports.getLogin = async (req, res, next) => {
	try {
		let message = req.flash('error');

		await res.render('auth/login', {
			path: '/login',
			pageTitle: 'Login',
			errorMessage: message[0],
			oldMessage: {
				email: '',
				password: ''
			},
			validation: []
		});
	} catch (error) {
		const err = new Error(error);
		err.httpStatusCode = 500;
		return next(err);
	}
};

exports.getSignup = async (req, res, next) => {
	try {
		let message = req.flash('email_invalid');
		await res.render('auth/signup', {
			path: '/signup',
			pageTitle: 'Signup',
			errorMessage: message[0],
			oldMessage: {
				email: '',
				password: '',
				confirmPassword: ''
			},
			validation: []
		});
	} catch (error) {
		const err = new Error(error);
		err.httpStatusCode = 500;
		return next(err);
	}
};

exports.getReset = async (req, res, next) => {
	try {
		let message = req.flash('error');

		await res.render('auth/reset', {
			path: '/reset',
			pageTitle: 'Reset Password',
			errorMessage: message[0]
		});
	} catch (error) {
		const err = new Error(error);
		err.httpStatusCode = 500;
		return next(err);
	}
};

exports.getNewPassword = async (req, res, next) => {
	try {
		const token = req.params.token;

		const user = await User.findOne({
			resetToken: token,
			resetTokenExpiration: { $gt: Date.now() }
		});

		if (!user) {
			return await res.send(`<h2>Token Expired.</h2>
				<h4><a href="/reset"> Click </a> to go back </h4>`);
		}

		let message = await req.flash('error');

		await res.render('auth/new-password', {
			userId: user._id.toString(),
			pageTitle: 'New Password',
			path: '/new-password',
			errorMessage: message[0],
			passwordToken: token
		});
	} catch (error) {
		const err = new Error(error);
		err.httpStatusCode = 500;
		return next(err);
	}
};

exports.postLogin = async (req, res, next) => {
	try {
		const email = req.body.email;
		const password = req.body.password;

		const validationErrors = validationResult(req);
		if (!validationErrors.isEmpty()) {
			return await res.status(422).render('auth/login', {
				path: '/login',
				pageTitle: 'Login',
				errorMessage: validationErrors.array()[0].msg,
				oldMessage: {
					email: email,
					password: password
				},
				validation: validationErrors.array()
			});
		}

		const user = await User.findOne({ email: email });

		const isMatched = await bcrypt.compare(password, user.password);

		if (!isMatched) {
			return await res.render('auth/login', {
				path: '/login',
				pageTitle: 'Login',
				errorMessage: 'Invalid Email or Password',
				oldMessage: {
					email: email,
					password: password
				},
				validation: []
			});
		}
		req.session.userLoggedIn = user;

		req.session.isAuthenticated = true;
		await req.session.save();
		return await res.redirect('/');
	} catch (error) {
		const err = new Error(error);
		err.httpStatusCode = 500;
		return next(err);
	}
};

exports.postSignup = async (req, res, next) => {
	try {
		const email = req.body.email;
		const password = req.body.password;
		// const confirmpassword = req.body.confirmPassword;

		const validationErrors = validationResult(req);

		if (!validationErrors.isEmpty()) {
			return await res.status(422).render('auth/signup', {
				path: '/signup',
				pageTitle: 'Signup',
				errorMessage: validationErrors.array()[0].msg,
				oldMessage: {
					email: email,
					password: password,
					confirmPassword: req.body.confirmPassword
				},
				validation: validationErrors.array()
			});
		}

		const hash = await bcrypt.hash(password, 12);

		const user = new User({
			email: email,
			password: hash,
			cart: { items: [] }
		});

		const signupMessage = {
			to: user.email,
			from: env.MY_EMAIL,
			subject: 'Signup to GeneRaX successful!',
			html: `<h1> Thankyou for signing up to GeneRaX! </h1>`
		};

		await user.save();
		res.redirect('/login');

		return await sgMail.send(signupMessage);
	} catch (error) {
		const err = new Error(error);
		err.httpStatusCode = 500;
		return next(err);
	}
};

exports.postLogout = async (req, res, next) => {
	try {
		await req.session.destroy();
		await res.redirect('/');
	} catch (error) {
		const err = new Error(error);
		err.httpStatusCode = 500;
		return next(err);
	}
};

exports.postReset = async (req, res, next) => {
	try {
		const token = nanoid();
		const user = await User.findOne({ email: req.body.email });

		if (!user) {
			req.flash('error', 'No account with that email found.');
			return await res.redirect('/reset');
		}

		user.resetToken = token;
		user.resetTokenExpiration = Date.now() + 3600000;
		await user.save();

		const resetMessage = {
			to: user.email,
			from: env.MY_EMAIL,
			subject: 'Password Reset',
			html: `<h3> To Reset your password </h3>
				<p><strong>Click this <a href="http://localhost:3000/reset/${token}" target="_blank"><em>Link</em></a></strong></p>`
		};

		res.redirect('/');
		return await sgMail.send(resetMessage);
	} catch (error) {
		const err = new Error(error);
		err.httpStatusCode = 500;
		return next(err);
	}
};

exports.postNewPassword = async (req, res, next) => {
	try {
		const newPassword = req.body.newPassword;
		const passToken = req.body.passwordToken;
		const userId = req.body.userId;

		const user = await User.findOne({
			resetToken: passToken,
			resetTokenExpiration: { $gt: Date.now() },
			_id: userId
		});

		const hashedPassword = await bcrypt.hash(newPassword, 12);

		user.password = hashedPassword;
		user.resetToken = undefined;
		user.resetTokenExpiration = undefined;

		await user.save();
		return await res.redirect('/login');
	} catch (error) {
		const err = new Error(error);
		err.httpStatusCode = 500;
		return next(err);
	}
};

/*

exports.postTemplate = async (req, res, next) => {
	try {
		
	} catch (error) {
		const err = new Error(error);
		err.httpStatusCode = 500;
		return next(err);
		
	}
}

*/
