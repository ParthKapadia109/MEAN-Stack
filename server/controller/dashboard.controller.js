const Role = require('../model/role')
const User = require('../model/user')
const Module = require('../model/module')

exports.dashboard_counter = (req, res, next) => {

    var slug = 'supper-admin'
    Role.countDocuments({role_slug : {$ne : slug}},(error, roleCount) => {
        if (error) {
            return next(error)
        } else {
            Module.countDocuments((error, moduleCount) => {
                if (error) {
                    return next(error)
                } else {
                    User.countDocuments({role : {$ne : slug}},(error, userCount) => {
                        if (error) {
                            return next(error)
                        } else {
                            User.aggregate(
                                [
                                    {
                                        $group:
                                        {
                                            _id:
                                            {
                                                month: { $month: "$createdAt" },
                                                role : "$role"
                                            },
                                            count: { $sum: 1 },
                                        }
                                    }
                                ]
                                , (error, barChart) => {
                                    if (error) {
                                        console.log(error);
                                        return next(error)
                                    } else {
                                        User.aggregate([{ $group: { _id: {role : "$role"}, count: { $sum: 1 } } }], (error, pieChart) => {
                                            if (error) {
                                                return next(error);
                                            } else {

                                                User.aggregate([{ $group: {_id: { month: { $month: "$createdAt" }}}}, { $sort : {'_id.month': 1} }], (error, months) => {
                                                    if(error) {
                                                        return next(error);
                                                    } else {
                                                        User.aggregate([{ $group: { _id: { year: { $year: "$createdAt" } } } }], (error, years) => {
                                                            if (error) {
                                                                return next(error);
                                                            } else {
                                                                const dashboardData = {
                                                                    countAll: {
                                                                        module: moduleCount,
                                                                        role: roleCount,
                                                                        user: userCount
                                                                    },
                                                                    pieChartData: pieChart,
                                                                    barChartData: barChart,
                                                                    monthsList: months,
                                                                    yearsList: years
                                                                }
                                                                res.json({ response: true, data: dashboardData, message: "Successfully get the Data !" })
                                                            }
                                                        });
                                                    }
                                                })
                                            }
                                        })
                                    }
                                });
                        }
                    })
                }
            })
        }
    })
}

exports.barChartYearWise = (req, res, next) => {
    let year = req.body.year;
    User.aggregate([
        {
            $group:
            { 
                _id: { 
                    month: { $month: "$createdAt" }, 
                    year: { $year: "$createdAt" },
                    role : "$role"
                },
                count: { $sum: 1 }
            }, 
        }
    ]
    , (error, barChart) => {
        if (error) {
            return next(error)
        } else {
            const newBarData = []
            barChart.forEach(element => {
                if(element._id.year == year) {
                    newBarData.push(element);
                }
            });
            res.json({ response: true, data: {barChartData: newBarData}, message: "Successfully get the Data !" })
        }
    });
}

exports.doughnutChartMonthWise = (req, res, next) => {
    let month = req.body.month;
    User.aggregate([
        {
            $group:
            { 
                _id: { 
                    month: { $month: "$createdAt" }, 
                    role: "$role",
                },
                count: { $sum: 1 }
            }, 
        }
    ]
    , (error, doughnutChart) => {
        if (error) {
            return next(error)
        } else {
            const newData = []
            doughnutChart.forEach(element => {
                if(element._id.month == month) {
                    newData.push(element);
                }
            });
            res.json({ response: true, data: {doughnutChart: newData}, message: "Successfully get the Data !" })
        }
    });
}