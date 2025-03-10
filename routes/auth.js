const express = require('express');
const { check, body } = require('express-validator');
const authentication = require('../middleware/is-auth');
const User = require('../models/user');
const authController = require('../controllers/auth');
const routers = express.Router();

routers.get('/login', authController.getLogin);

routers.post(
	'/login-form',

	[
		body('email')
			.custom(async (value) => {
				const user = await User.findOne({ email: value });
				if (!user) {
					throw new Error('Invalid Email or Password');
				}
				return true;
			})
			.normalizeEmail(),
		body('password').isLength({ min: 5 }).isAlphanumeric().trim()
	],
	authController.postLogin
);

routers.post('/logout', authentication, authController.postLogout);

routers.post(
	'/signup',
	[
		check('email')
			.isEmail()
			.withMessage('Please enter a valid email.')
			.custom(async (value) => {
				let user = await User.findOne({ email: value });

				if (user) {
					throw new Error('Email already exists');
				}
				return true;
			})
			.normalizeEmail(),
		body(
			'password',
			'Password should only be alphanumeric and more than 6 characters'
		)
			.isLength({ min: 6 })
			.isAlphanumeric(),
		body('confirmPassword').custom((value, { req }) => {
			const password = req.body.password.trim();
			value = value.trim();
			if (value !== password) {
				throw new Error('Passwords has to match');
			}
			return true;
		})
	],
	authController.postSignup
);

routers.get('/signup', authController.getSignup);

routers.get('/reset', authController.getReset);

routers.post('/reset', authController.postReset);

routers.get('/reset/:token', authController.getNewPassword);

routers.post('/new-password', authController.postNewPassword);

module.exports = routers;
