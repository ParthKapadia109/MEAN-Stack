const express = require('express');
const { authLogin, userValidation, forgotPassword, recoverPassword, validate } = require('../middleware/validation');
const app = express();
const JwtVerify = require('../middleware/jwtToken');
const UserController = require('../controller/user.controller');

const authRoute = express.Router();

const authcontroller = require('../controller/auth.controller');

authRoute.route('/login').post(authLogin(), validate, authcontroller.login_user);
authRoute.route('/frontLogin').post(authLogin(), validate, authcontroller.front_login_user);

// authRoute.route('/frontLogin').post(authLogin(), validate, authcontroller.frontEndLogin);

authRoute.route('/logout').get(JwtVerify.validateToken, authcontroller.logout);

authRoute.route('/register').post(userValidation(), validate, UserController.add_user);

authRoute.route('/forgot-password').post(forgotPassword(), validate, authcontroller.forgotPassword);

authRoute.route('/recover-password/').post(recoverPassword(), validate, authcontroller.recoverPassword);

module.exports = authRoute;