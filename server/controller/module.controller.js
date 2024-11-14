const Module = require('../model/module');
var slugify = require('slugify')
const RoleAuth = require('../model/role-auth');
exports.add_module = (req, res, next) => {

    const title = req.body.title;
    const status = req.body.status;
    const module_slug = create_slug(title);

    Module.countDocuments({ module_slug: { $eq: module_slug } }, (error, count) => {
        if (error) {
            return error;
        } else {
            if (count === 0) {
                const subArr = Array();
                subArr.push(req.body.sub_module_title);
                sub_module_array = Array();
                let sub_module_slug_array = Array();
                subArr[0].forEach(element => {
                    const slug = create_slug(element);
                    sub_module_slug_array.push(slug)
                    const sub = {
                        sub_module_title: element,
                        sub_module_slug: slug
                    }
                    sub_module_array.push(sub);
                });

                const module_data = {
                    title: title,
                    module_slug: module_slug,
                    sub_module: sub_module_array,
                    status: status
                }

                Module.create(module_data, (error, data) => {
                    if (error) {
                        return next(error);
                    } else {
                        RoleAuth.find({role_slug : {$eq : 'supper-admin'}}, {sub_module : 1, _id : 0},(error, roleAuthData) => {
                            if(error) { return next(error) }
                            else {
                                const oldSlug = roleAuthData[0].sub_module;
                                const newSlug = [...oldSlug, ...sub_module_slug_array];

                                RoleAuth.findOneAndUpdate({role_slug : {$eq : 'supper-admin'}}, {$set : {sub_module : newSlug}}, (error, updateSlug) => {
                                    if(error) { return next(error) }
                                    else {
                                        res.json({ response: true, message: "Successfully inserted the module ", data: data });
                                    }
                                });
                            }
                        })
                    }
                })
            } else {
                res.json({response: false, errors: {title : "This module title is already exist."}});
            }
        }
    })
}

exports.get_all_module = (req, res, next) => {
    Module.find((error, data) => {
        if(error) {
            return next(error);
        } else {
            res.json({ response: true, message: "Successfully get all the module ", data: data });
        }
    }).sort( { createdAt: -1 } )
}

exports.delete_module = (req, res, next) => {
    const module_slug = req.params.slug;

    Module.countDocuments({module_slug : {$eq : module_slug}}, (error, count) => {
        if(error) {
            return next(error)
        } else {
            if(count === 1) {
                Module.findOne({module_slug : {$eq : module_slug}}, (error, moduleData) => {
                    if(error) {
                        return next(error);
                    } else {
                        let sub_module = Array()
                        moduleData.sub_module.forEach((ele) => {
                            sub_module.push(ele.sub_module_slug)
                        });
                        RoleAuth.find((error, RoleAuthData) => {
                            if(error) {
                                return next(error)
                            } else {
                               
                                RoleAuthData.forEach((element) => {
                                    const newSlug = element.sub_module.filter((val) => !sub_module.includes(val));
                                    RoleAuth.findOneAndUpdate({$and : [{role_slug : {$eq : element.role_slug}}, {_id : {$eq : element._id}}]}, {$set : {sub_module : newSlug}}, (error, permissionData) => {
                                        if(error) {
                                            return next(error);
                                        } 
                                    })
                                })
                            }
                        })
                        Module.findOneAndRemove({module_slug : {$eq : module_slug}}, (error, data) => {
                            if(error) {
                                return next(error)
                            } else { 
                                res.json({ response: true, message: "Successfully deleted the module." });
                            }
                        })
                    }

                })
                
            } else {
                res.json({response: false, errors: "Module slug is invalid."});
            }
        }
    })
}

exports.find_module = (req, res, next) => {
    const module_slug = req.params.slug;

    Module.countDocuments({module_slug : {$eq : module_slug}}, (error, count) => {
        if(error) {
            return next(error)
        } else {
            if(count === 1) {
                Module.findOne({module_slug : {$eq : module_slug}}, (error, data) => {
                    if(error) {
                        return next(error)
                    } else { 
                        res.json({ response: true, message: "Successfully get the module details ", data: data });
                    }
                })
            } else {
                res.json({response: false, errors: "Module slug is invalid."});
            }
        }
    })
}

exports.sub_module_delete = (req, res, next) => {
    const module_slug = req.params.slug;
    const sub_module_slug = req.params.sub_slug;

    Module.countDocuments({module_slug : {$eq : module_slug}}, (error, count) => {
        if(error) {
            return next(error)
        } else {
            if(count === 1) {
                Module.findOne({module_slug : {$eq : module_slug}}, (error, data) => {
                    if(error) {
                        return next(error)
                    } else { 
                        let sub_module_slug_array = data.sub_module.filter(sub_slug => {
                            return sub_slug.sub_module_slug != sub_module_slug;
                        });
                        
                        const module_data = {
                            title: data.title,
                            sub_module: sub_module_slug_array,
                            status: data.status
                        }

                        Module.findOneAndUpdate({module_slug : {$eq : module_slug}}, {$set : module_data}, (error, data) => {
                            if(error) {
                                return error;
                            } else {
                                res.json({response: true, message: "Successfully deleted the sub module."});
                            }
                        })
                    }
                })
            } else {
                res.json({response: false, errors: "Module slug is invalid."});
            }
        }
    })
}

exports.update_module = (req, res, next) => {
    const module_slug = req.params.slug;

    Module.countDocuments({module_slug : {$eq : module_slug}}, (error, count) => {
        if(error) {
            return error;
        } else {
            if(count === 1) {
                const title = req.body.title;
                const status = req.body.status;
                const subArr = Array();
                subArr.push(req.body.sub_module_title);
                sub_module_array = Array();
                let sub_module_slug_array = Array();
                subArr[0].forEach(element => {
                    const slug = create_slug(element);
                    sub_module_slug_array.push(slug);
                    const sub = {
                        sub_module_title: element,
                        sub_module_slug: slug
                    }
                    sub_module_array.push(sub);
                });
                const module_data = {
                    title: title,
                    sub_module: sub_module_array,
                    status: status
                }

                Module.findOneAndUpdate({module_slug : {$eq : module_slug}}, {$set : module_data}, (error, data) => {
                    if(error) {
                        return next(error);
                    } else {
                        Module.find((err, moduleData) => {
                            if(err) {
                                return next(err);
                            } else {
                                const newSlug = Array()
                                moduleData.forEach((element) => {
                                    element.sub_module.forEach((ele) => {
                                        newSlug.push(ele.sub_module_slug);
                                    });
                                });
                                RoleAuth.findOneAndUpdate({role_slug : {$eq : 'supper-admin'}}, {$set : {sub_module : newSlug}}, (error, updateSlug) => {
                                    if(error) { return next(error) }
                                    else {
                                        res.json({ response: true, message: "Successfully updated the module ", data: module_data });
                                    }
                                });
                            }
                        })
                        // res.json({response:true, message: "Successfully Update The Module", data: module_data});
                    }
                })
            } else {
                res.json({response: false, errors : "Module slug is not define !"});
            }
        }
    })
}

function create_slug(slug) {
    var generate = slugify(slug, {
        replacement: '-',
        remove: undefined,
        lower: true,
        strict: false,
        locale: 'vi'
    });

    return generate;
}