const bcrypt = require('bcryptjs');
const sgMail = require('@sendgrid/mail');

require('dotenv').config();

const { env } = require('process');

const { nanoid } = require('nanoid');

const User = require('../models/user');

sgMail.setApiKey(env.SEND_GRID_APIKEY);

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

exports.getReset = async (req, res) => {
	try {
		let message = req.flash('error');
		console.log(message);

		await res.render('auth/reset', {
			path: '/reset',
			pageTitle: 'Reset Password',
			errorMessage: message[0]
		});
	} catch (error) {
		console.log(error);
	}
};

exports.getNewPassword = async (req, res) => {
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
		console.log(error);
	}
};

exports.postLogin = async (req, res) => {
	try {
		const email = req.body.email;
		const password = req.body.password;

		if (!email || !password) {
			req.flash('error', 'Field(s) cannot be empty');
			return await res.redirect('/login');
		}

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
		await req.session.save();
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

		if (!email || !password) {
			req.flash('email_invalid', 'Field(s) cannot be empty');
			return await res.redirect('/signup');
		}

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
		console.log(error);
	}
};

exports.postLogout = async (req, res) => {
	try {
		await req.session.destroy();
		await res.redirect('/');
	} catch (error) {
		console.log(error);
	}
};

exports.postReset = async (req, res) => {
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
		console.log(error);
	}
};

exports.postNewPassword = async (req, res) => {
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
		console.log(error);
	}
};

/*

exports.postTemplate = async (req, res) => {
	try {
		
	} catch (error) {
		console.log(error);
		
	}
}

*/
