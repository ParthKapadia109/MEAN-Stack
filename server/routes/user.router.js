const express = require('express');
const app = express();

const { userValidation, validate, editUserValidation, user_permission, validateUserToken } = require('../middleware/validation');
const JwtVerify = require('../middleware/jwtToken');
const userRoute = express.Router();
const UserController = require('../controller/user.controller');

userRoute.route('/add-user').post(JwtVerify.validateToken, userValidation(), validate, UserController.add_user);

userRoute.route('/activation').post(validateUserToken(), validate, UserController.accountActivate);

userRoute.route('/view-user').get(JwtVerify.validateToken, UserController.view_all_user);    

userRoute.route('/delete-user/:slug').delete(JwtVerify.validateToken, UserController.delete_user_by_slug);

userRoute.route('/find-user/:slug').get(JwtVerify.validateToken, UserController.find_user_by_slug);
userRoute.route('/update-user/:_id').put(JwtVerify.validateToken, editUserValidation(), validate, UserController.update_user_by_id);

userRoute.route('/user-permission').post(JwtVerify.validateToken, user_permission(), validate,UserController.add_permission_for_user);
userRoute.route('/toggle-update').post(JwtVerify.validateToken, UserController.toggle_update);

userRoute.route('/custom-theme').post(JwtVerify.validateToken, UserController.custom_theme_color);

userRoute.route('/changeStatusUser').post(JwtVerify.validateToken, UserController.changeStatus);
module.exports = userRoute;
