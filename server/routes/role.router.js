const express = require('express');
const { validate } = require('../middleware/validation');
const app = express();
const roleRoute = express.Router();
const JwtVerify = require('../middleware/jwtToken');

const { roleValidation } = require('../middleware/validation');

const roleController = require('../controller/role.controller');
const role = require('../model/role');

//add-role
roleRoute.route('/add-role').post(JwtVerify.validateToken, roleValidation(), validate, roleController.add_role);

//View all role
roleRoute.route('/role').get(JwtVerify.validateToken, roleController.get_all_role);

//find by slug 
roleRoute.route('/find-role/:slug').get(JwtVerify.validateToken, roleController.find_role_by_slug)

//update the role by slug
roleRoute.route('/update-role/:slug').put(JwtVerify.validateToken, roleValidation(), validate, roleController.update_role_by_slug)

//delete the role by slug
roleRoute.route('/delete-role/:slug').delete(JwtVerify.validateToken, roleController.delete_role)

roleRoute.route('/select-role').get(JwtVerify.validateToken,roleController.select_role);

roleRoute.route('/changeStatusRole').post(JwtVerify.validateToken, roleController.changeStatus);

module.exports = roleRoute;