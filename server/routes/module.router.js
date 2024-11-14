const express = require('express');
const { moduleValidation, validate } = require('../middleware/validation');
const app = express();
const moduleRoute = express.Router();
const JwtVerify = require('../middleware/jwtToken');
const ModuleController = require('../controller/module.controller');

moduleRoute.route('/add-module').post(JwtVerify.validateToken, moduleValidation(), validate, ModuleController.add_module);

moduleRoute.route('/view-module').get(JwtVerify.validateToken, ModuleController.get_all_module);

moduleRoute.route('/delete-module/:slug').delete(JwtVerify.validateToken, ModuleController.delete_module);

moduleRoute.route('/delete-sub-module/:slug/:sub_slug').delete(JwtVerify.validateToken, ModuleController.sub_module_delete);

moduleRoute.route('/find-module/:slug').get(JwtVerify.validateToken, ModuleController.find_module);

moduleRoute.route('/update-module/:slug').put(JwtVerify.validateToken, moduleValidation(), validate, ModuleController.update_module);

module.exports = moduleRoute;