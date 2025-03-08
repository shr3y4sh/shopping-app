const User = require('../models/user');

exports.getLogin = async (req, res) => {
	try {
		await res.render('auth/login', {
			path: '/login',
			pageTitle: 'Login',
			isAuthenticated: req.session.isAuthenticated
		});
	} catch (error) {
		console.log(error);
	}
};

exports.postLogin = async (req, res) => {
	try {
		const user = await User.findById('67cc0fa71bf4a445811a8eef');

		req.session.userLoggedIn = user;
		req.session.isAuthenticated = true;
		await req.session.save();
		await res.redirect('/');
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
