const express = require('express');

const authentication = require('../middleware/is-auth');

const authController = require('../controllers/auth');
const routers = express.Router();

routers.get('/login', authController.getLogin);

routers.post('/login-form', authController.postLogin);

routers.post('/logout', authentication, authController.postLogout);

routers.post('/signup', authController.postSignup);

routers.get('/signup', authController.getSignup);

routers.get('/reset', authController.getReset);

routers.post('/reset', authController.postReset);

routers.get('/reset/:token', authController.getNewPassword);

routers.post('/new-password', authController.postNewPassword);

module.exports = routers;
