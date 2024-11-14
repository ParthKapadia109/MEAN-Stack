const express = require('express')
const mailRoute = express.Router();
const JwtVerify = require('../middleware/jwtToken');
const { mailValidation, validate } = require('../middleware/validation');

const mailTemplateController = require('../controller/mail-template.controller');

mailRoute.route('/addMailTemplate').post(JwtVerify.validateToken, mailValidation(), validate, mailTemplateController.addMailTemplate);

mailRoute.route('/viewMailTemplate').get(JwtVerify.validateToken, mailTemplateController.viewMailTemplate);

mailRoute.route('/findMailDetails/:slug/:id').get(JwtVerify.validateToken, mailTemplateController.findMailDetails);

mailRoute.route('/updateMailDetail/:id').put(JwtVerify.validateToken, mailValidation(), validate, mailTemplateController.updateMailDetails);

mailRoute.route('/deleteMailDetail/:id').delete(JwtVerify.validateToken, mailTemplateController.deleteMailDetails);

mailRoute.route('/changeStatusMail/:id').put(JwtVerify.validateToken, mailTemplateController.changeStatus);

module.exports = mailRoute;