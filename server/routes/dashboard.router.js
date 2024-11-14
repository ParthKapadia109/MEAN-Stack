const express = require('express');
const dashboardRoute = express.Router();
const DashboardController = require('../controller/dashboard.controller')
const JwtVerify = require('../middleware/jwtToken');

dashboardRoute.route('/dashboard').get(JwtVerify.validateToken, DashboardController.dashboard_counter);
dashboardRoute.route('/dashboard/barChart').post(JwtVerify.validateToken, DashboardController.barChartYearWise);
dashboardRoute.route('/dashboard/doughnutChart').post(JwtVerify.validateToken, DashboardController.doughnutChartMonthWise);

module.exports = dashboardRoute;