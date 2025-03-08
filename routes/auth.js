const express = require('express');

const authController = require('../controllers/auth');
const routers = express.Router();

routers.get('/login', authController.getLogin);

routers.post('/login-form', authController.postLogin);

routers.post('/logout', authController.postLogout);

module.exports = routers;
