const express = require('express');
const { validate, roleAuth } = require('../middleware/validation');
const app = express();
const roleAuthRoute = express.Router();
const JwtVerify = require('../middleware/jwtToken');
const RoleAuthController = require('../controller/role-auth.controller');

roleAuthRoute.route('/add-permission').post(JwtVerify.validateToken, roleAuth(), validate, RoleAuthController.add_role_permission);

roleAuthRoute.route('/view_permission/:slug').get(JwtVerify.validateToken, RoleAuthController.view_permission);

module.exports = roleAuthRoute;