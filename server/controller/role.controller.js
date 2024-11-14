let Role = require('../model/role');
var slugify = require('slugify')
let User = require('../model/user')
let RoleAuth = require('../model/role-auth');

exports.add_role = (req, res, next) => {
    var slug = slugify(req.body.role_name, {
        replacement: '-',  
        remove: undefined, 
        lower: true,      
        strict: false,     
        locale: 'vi'      
      });
    

    Role.count({$and : [{role_name : {$eq : req.body.role_name}}, {role_slug : {$eq : slug}}]}, (err, count) => {
        if(err) {
            return next(err);
        } else {
            if(count === 0) {
                const roleData = {
                    role_name : req.body.role_name,
                    role_slug : slug,
                    role_status : req.body.role_status
                }
                Role.create(roleData, (error, data) => {
                    if(error) {
                        return next(error);
                    } else {
                        let roleAuth = {
                            role_slug : slug,
                            status : true,
                            sub_module : []
                        }
                        RoleAuth.create(roleAuth, (error, roleAuthResp) => {
                            if(error) {
                                return next(error)
                            } else {
                                res.json({response : true, message : "The role added successfully. ", data : data});
                            }
                        })
                    }
                })
            } else {
                res.json({response : false, errors : "This role already exist."});
            }
        }
    })
}

exports.get_all_role = (req, res, next) => {
    const { user } = req.decoded;
    User.findOne({email : {$eq : user}}, {role: 1}, (err, userData) => {
        if(err) { return next(err) }
        else {
            const roleSlug = 'supper-admin';
            Role.find({$and : [{role_slug : {$ne : userData.role}}, {role_slug : {$ne : roleSlug}}]}, (error, data) => {
                if (error) {
                  return next(error)
                } else {
                  res.json({response : true, message : "Successfully get all the role ", data : data})
                }
            }).sort( { createdAt: -1 } )
        }
    });
    
}

exports.find_role_by_slug = (req, res, next) => {
    Role.find({role_slug : {$eq : req.params.slug}}, (error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json({response : true, message : "Successfully get the role ", data : data[0]})
        }
    })
}

exports.update_role_by_slug = (req, res, next) => {
    const roleData = {
        role_name : req.body.role_name,
        role_status : req.body.role_status
    }
    Role.count({role_slug : {$eq : req.params.slug}}, (err, count) => {
        if(err) {
            return next(err);
        } else {
            if(count === 1) {
                Role.findOneAndUpdate({role_slug : {$eq : req.params.slug}}, {$set : roleData}, (error, data) => {
                    if (error) {
                        return next(error)
                    } else {
                        res.json({response : true, message : "The role edited successfully.", data : roleData})
                    }
                })
            } else {
                res.json({response : false, errors : "Slug invalid."});
            }
        }
    });
    
}

exports.delete_role = (req, res) => {
    Role.count({role_slug : {$eq : req.params.slug}}, (err, count) => {
        if(err) {
            return next(err);
        } else {
            if(count === 1) {
                User.countDocuments({role : {$eq : req.params.slug}}, (error, userCount)=> {
                    if(error) {
                        return next(error)
                    } else {
                        console.log(userCount);
                        if(userCount === 0) {
                            Role.findOneAndDelete({role_slug: {$eq : req.params.slug}}, (error, data) => {
                                if (error) {
                                    return next(error)
                                } else {
                                    res.json({response : true, message : "The role deleted successfully."});
                                }
                            })
                        } else {
                            res.json({response : false, errors : "The role is not deleted. You have first remove the user."});
                        }
                    }
                })
                
            } else {
                res.json({response : false, errors : "Slug invalid."});
            }
        }
    })
}

exports.select_role = (req, res) => {
    const roleSlug = 'supper-admin';
    Role.find({$and : [{role_slug : {$ne : roleSlug}}]}, (error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json({response : true, message : "Successfully get all the role ", data : data})
        }
    }).sort( { createdAt: -1 } )
}

exports.changeStatus = (req, res, next) => {
    var _id = req.body._id;
    var status = req.body.status;
    var slug = req.body.slug;

    Role.findOneAndUpdate({$and : [{_id : {$eq : _id}}, {role_slug : {$eq : slug}}]}, {$set : {role_status : status}}, (error, role) => {
        if(error) {
            return next(error)
        } else {
            res.json({response : true, message : "The role status updated successfully."})
        }
    })
}