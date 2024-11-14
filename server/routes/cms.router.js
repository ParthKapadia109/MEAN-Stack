const express = require('express')
const cmsRoute = express.Router();
const JwtVerify = require('../middleware/jwtToken');
const { cmsValidation, validate } = require('../middleware/validation');
const CMSController = require('../controller/cms.controller')

cmsRoute.route('/add-cms-details').post(JwtVerify.validateToken, cmsValidation(), validate, CMSController.cms_added)

cmsRoute.route('/get-cms').get(JwtVerify.validateToken, CMSController.get_cms);

cmsRoute.route('/delete-cms/:slug/:_id').delete(JwtVerify.validateToken, CMSController.delete_cms)

cmsRoute.route('/edit-cms/:slug/:_id').get(JwtVerify.validateToken, CMSController.edit_cms)

cmsRoute.route('/update-cms/:_id').put(JwtVerify.validateToken, CMSController.update_cms)


cmsRoute.route('/get-front-cms').get(CMSController.get_cms_front);

cmsRoute.route('/get-cms-detail/:slug').get(CMSController.get_cms_detail)

cmsRoute.route('/changeStatusCMS').post(JwtVerify.validateToken, CMSController.changeStatus);

module.exports = cmsRoute;
