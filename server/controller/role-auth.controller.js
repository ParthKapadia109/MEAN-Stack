const RoleAuth  = require('../model/role-auth');
const Role = require('../model/role');
const Module = require('../model/module');
const User = require('../model/user');

exports.add_role_permission = (req, res, next) => {
    const role_slug = req.body.role_slug;
    const sub_module = req.body.sub_module;
    const status = req.body.status;

    Role.countDocuments({role_slug : {$eq : role_slug}}, (error, count) => {
        if(error) {
            return next(error)
        } else {
            if(count === 1) {

                RoleAuth.find({role_slug : role_slug}, (error, result) => {
                    if(error) {
                        return next(error)
                    } else {
                        if(result[0] && result[0]._id) {
                            const role_auth_update ={sub_module: sub_module, status : status};
                            RoleAuth.findByIdAndUpdate({_id : result[0]._id}, {$set : role_auth_update}, (error, data) => {
                                if(error) {
                                    return next(error)
                                } else {
                                    console.log(result[0].sub_module);
                                    User.update({$and : [{role : {$eq: role_slug}}, {user_permission : {$eq : result[0].sub_module}}]}, {$set : {user_permission : sub_module}}, (error, data) => {
                                        if(error) {
                                            return error;
                                        } else {
                                            // res.json(data)
                                            const newdta = { 
                                                role_slug : role_slug,
                                                sub_module : sub_module,
                                                status : status
                                            }
        
                                            res.json({response:true, message: "The permission added successfully. ", data : newdta})
                                        }
                                    })
                                    
                                }
                            })

                        } else {
                            const role_auth = {
                                role_slug : role_slug,
                                sub_module : sub_module,
                                status : status
                            } 
                            RoleAuth.create(role_auth, (error, data) => {
                                if(error) {
                                    return next(error)
                                } else {
                                    res.json({response:true, message: "Successfully apply the permission ", data : data});
                                }
                            })
                        }
                    }
                })
            } else {
                res.json({response: false, errors:  "This role can't exist."})
            }
        }
    })
}

exports.view_permission = (req, res) => {
    const role_slug = req.params.slug;

    RoleAuth.countDocuments({role_slug : {$eq : role_slug}}, (error, count) => {
        if(error) {
            return next(error)
        } else {
            if(count === 1) {
                RoleAuth.find({role_slug : {$eq : role_slug}}, (error, data) => {
                    if(error) {
                        return next(error)
                    } else {
                        res.json({response:true, message:"Successfully get the all permission ", data : data[0]});
                    }
                })
            } else {
                res.json({response: false, errors:  "This role can't permission to apply."})
            }
        }
    })
}