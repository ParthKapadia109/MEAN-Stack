const express = require('express')
const mailRoute = express.Router();
const JwtVerify = require('../middleware/jwtToken');
const { mailSettingValidation, validate } = require('../middleware/validation');
const mailSettingController = require('../controller/mail-setting.controller');

mailRoute.route('/testMailConfiguration').get(mailSettingController.testingMail);

mailRoute.route('/updateMailConfiguration').post(JwtVerify.validateToken, mailSettingValidation(), validate, mailSettingController.mailConfiguration)

mailRoute.route('/getMailConfiguration').get(JwtVerify.validateToken, mailSettingController.getMailConfiguration);

module.exports = mailRoute;