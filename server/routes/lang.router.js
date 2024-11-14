const express = require('express')
const LangRoute = express.Router();
const JwtVerify = require('../middleware/jwtToken');
const { langValidation, validate } = require('../middleware/validation');
const LangController = require('../controller/lang.controller')

LangRoute.route('/add_lang').post(JwtVerify.validateToken, langValidation(), validate, LangController.lang_added)

LangRoute.route('/get_lang').post(JwtVerify.validateToken, LangController.get_lang);

LangRoute.route('/get_user_selected_lang').post(JwtVerify.validateToken, LangController.get_user_selected_lang);

LangRoute.route('/update_lang').post(JwtVerify.validateToken, LangController.update_lang);

module.exports = LangRoute;