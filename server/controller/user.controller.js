const User          = require('../model/user');
const Role          = require('../model/role');
const jwt           = require("jsonwebtoken");
var crypto          = require("crypto");
const bcrypt        = require('bcrypt');
const nodemailer    = require("nodemailer");
var slugify         = require('slugify')
const RoleAuth      = require('../model/role-auth');
const saltRounds    = 10;
const handlebars    = require('handlebars');
const MailTemplate  = require('../model/mailTemplate');
const MailSetting   = require('../model/mail-setting');

exports.add_user = (req, res, next) => {
    
    const email = req.body.email;
    const password = req.body.password;
    const confirm_password = req.body.confirm_password;
    const role = req.body.role;

    User.countDocuments({email : {$eq : email}}, (error, data) => {
        if(error) {
            res.json({response : false, errors : error});
            // return next(error);
        } else {
           if(data === 1) {
                res.json({response : false, errors : {email : "Email is already existing."}});
           } else {
               if(password === confirm_password) {
                    Role.countDocuments({$and : [{role_slug : {$eq : role}}, {role_status : {$eq : true}}]}, (err, res_data) => {
                        if(err) {
                            res.json({response : false, errors : err});
                            // return next(err);
                        } else {
                            if(res_data === 1) {
                                bcrypt.hash(password, saltRounds, function(err_pwd, hash) {
                                    if(err_pwd) {
                                        res.json({response : false, errors : err_pwd});
                                        // return next(err_pwd);
                                    } else {
                                        // Generate Slug using User Name
                                        var slug = slugify(req.body.user_name, {
                                            replacement: '-',  // replace spaces with replacement character, defaults to `-`
                                            remove: undefined, // remove characters that match regex, defaults to `undefined`
                                            lower: true,      // convert to lower case, defaults to `false`
                                            strict: false,     // strip special characters except replacement, defaults to `false`
                                            locale: 'vi'       // language code of the locale to use
                                          });
                                        User.countDocuments({user_slug : {$eq : slug}}, (err_count, count) => {
                                            if(err_count) {
                                                res.json({response : false, errors : err_count});
                                                // return next(err_count)
                                            } else {
                                                if(count === 1) {
                                                    res.json({response : false, errors : {user_name : "User name is already existing."}});
                                                } else {
                                                    RoleAuth.findOne({role_slug : {$eq : role}}, (error, data) => {
                                                        if(error) {
                                                            res.json({response : false, errors : error});
                                                            // return next(error)
                                                        } else {    
                                                            // const payload = {
                                                            //     user: { email: email }, 
                                                            // };
                                                            // const options = { expiresIn: 60 };
                                                            // const secret = "useractivationJWTTokenBaseVerification";
                                                            // const token = jwt.sign(payload, secret, options);
                                                            var token = crypto.randomBytes(20).toString('hex');
                                                            MailSetting.findOne({ mail_slug: { $eq: 'mail_configration' } }, (error, mailData) => {
                                                                if (error) {
                                                                    res.json({ response: false, message: "something went wrong please try again", error: error });
                                                                } else {
                                                                    let transporter = nodemailer.createTransport({
                                                                        service: mailData['service'],
                                                                        host: mailData['host'],
                                                                        port: mailData['port'],
                                                                        secure: mailData['secure'],
                                                                        auth: {
                                                                            user: mailData['email'],
                                                                            pass: mailData['password']
                                                                        },
                                                                    });
                                        
                                                                    MailTemplate.findOne({slug : {$eq : 'active-user'}}, (error, html) => {
                                                                       if(error) {
                                                                            res.json({response : false, message : "Something went wrong please try again."})
                                                                        } else {
                                                                            var template = handlebars.compile(html.description);
                                                                            var replacements = {
                                                                                // user_name: userData[0].user_name,
                                                                                user_name: req.body.user_name,
                                                                                email : email,
                                                                                // Server Detail
                                                                                active_user_link : "http://68.183.86.2:8000/node/angular"+"/account-activation?token="+token,
                                                                                link : "http://68.183.86.2:8000/node/angular"+"/account-activation?token="+token
                                                                                // Local Detail
                                                                                // active_user_link : "http://localhost:4200"+"/account-activation?token="+token,
                                                                                // link : "http://localhost:4200"+"/account-activation?token="+token,
                                                                            };
                                                                            var htmlToSend = template(replacements);
                                                                            var mailOptions = {
                                                                                from: mailData['email'],
                                                                                to: email,
                                                                                subject: 'Active user',
                                                                                html: htmlToSend
                                                                            };
                                                                            transporter.sendMail(mailOptions, function(error, info) {
                                                                               if (error) {
                                                                                res.json({response : false, errors : error});
                                                                                    // return next(error)
                                                                                } else {
                                                                                    let userData = {
                                                                                        user_name : req.body.user_name, 
                                                                                        email : email, 
                                                                                        password : hash, 
                                                                                        user_slug : slug, 
                                                                                        role : role, 
                                                                                        user_status : req.body.user_status,
                                                                                        user_permission : data.sub_module,
                                                                                        sidebar_toggle : req.body.sidebar_toggle,
                                                                                        user_verification_token: token,
                                                                                        user_activated_status: false
                                                                                    }
                                                                                    User.create(userData, (errors, datas) => {
                                                                                        if(errors) {
                                                                                            res.json({response : false, errors : errors});
                                                                                            // return next(errors);
                                                                                        } else {
                                                                                            // res.json({response : true, data : datas, message : "The user added successfully."});
                                                                                            res.json({
                                                                                                response: true,
                                                                                                message:
                                                                                                    "The user added successfully and mail sent to your email address. Please check the link in mail for active your profile.",
                                                                                                data : info
                                                                                            })
                                                                                        }
                                                                                    })
                                                                                }
                                                                            });
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        }
                                                    })
                                                }
                                            }
                                        })
                                    }
                                });
                            } else {
                                res.json({response : false, errors : {role : "Role is invalid and this role not actived."}});
                            }
                        }
                    })
               } else {
                    res.json({response : false, errors : {password : "Password is not same, please enter correct password."}});
               }
           }
        }
    });
}

exports.accountActivate = (req, res, next) => {
    var token = req.body.token;
    User.findOneAndUpdate({$and : [{user_verification_token : {$eq : token}}]}, {$set : {user_activated_status : true}}, (error, user) => {
        if(error) {
            res.json({response : false, errors : error});
            // return next(error);
        } else {
            res.json({response : true, message : "Your account is activated. You are able to login now."})
        }
    })
}

exports.view_all_user = (req, res, next) => {
    const { user } = req.decoded;
    User.find({$and : [{email : {$ne : user}}, {user_slug : {$ne : 'supper-admin'}}]}, (error, data) => {
        if(error) {
            res.json({response : false, errors : error});
            // return next(error);
        } else {
            res.json({response : true, data : data, message : "Successfully get all the user."});
        }
    }).sort( { createdAt: -1 } )
}

exports.delete_user_by_slug = (req, res, next) => {
    const slug = req.params.slug;
    
    User.countDocuments({user_slug : {$eq : slug}}, (error, count) => {
        if(error) {
            res.json({response : false, errors : error});
            // return next(error);
        }
        if(count == 1) {
            User.deleteOne({user_slug : {$eq : slug}}, (err, data) => {
                if(err) {
                    res.json({response : false, errors : err});
                    // return next(err);
                } else {
                    res.json({response : true, message : "The user deleted successfully."});
                }
            })
        } else {
            res.json({response : false, errors : "Something this wrong. please try aging."});
        }
    })
}

exports.find_user_by_slug = (req, res, next) => {
    const slug = req.params.slug;

    User.countDocuments({user_slug : {$eq : slug}}, (error, count) => {
        if(error) {
            res.json({response : false, errors : error});
            // return next(error);
        }

        if(count === 1) {
            User.findOne({user_slug : {$eq : slug}}, (err, data) => {
                if(err) {
                    res.json({response : false, errors : err});
                    // return next(err);
                } else {
                    res.json({response : true, message : "Successfully get the user details ", data : data});
                }
            })
        } else {
            res.json({response : false, errors : "Something this wrong. please try aging."})
        }
    })
}

exports.update_user_by_id = (req, res, next) => {
    const _id = req.params._id;

    const email = req.body.email;
    const role = req.body.role;
    
    User.countDocuments({$and : [{email : {$eq : email}}, {_id : {$ne : _id}}]}, (error, result) => {
        if(error) {
            res.json({response : false, errors : error});
            // return next(error);
        } else {
            if(result === 0) {
                var slug = slugify(req.body.user_slug, {
                    replacement: '-',  // replace spaces with replacement character, defaults to `-`
                    remove: undefined, // remove characters that match regex, defaults to `undefined`
                    lower: true,      // convert to lower case, defaults to `false`
                    strict: false,     // strip special characters except replacement, defaults to `false`
                    locale: 'vi'       // language code of the locale to use
                });
                User.countDocuments({$and : [{user_slug : {$eq : slug}}, {_id : {$ne : _id}}]}, (error, count) => {
                    if(error) {
                        res.json({response : false, errors : error});
                        // return next(error);
                    }
                    if(count === 0) {
                        if(req.body.password != "") {
                            if(req.body.password == req.body.confirm_password) {
                                bcrypt.hash(req.body.password, saltRounds, function(err_pwd, hash) {
                                    if(err_pwd) {
                                        res.json({response : false, errors : err_pwd});
                                        // return next(err_pwd);
                                    } else {
                                        let userData = {
                                            user_name : req.body.user_name, 
                                            user_status : req.body.user_status,
                                            role : req.body.role,
                                            password : hash,
                                            user_slug : slug,
                                            sidebar_toggle : req.body.sidebar_toggle
                                        }
                                        
                                        User.findOneAndUpdate({_id : {$eq : _id}}, {$set : userData}, (err, data) => {
                                            if(err) {
                                                res.json({response : false, errors : err});
                                                // return next(err);
                                            } else {
                                                res.json({response : true, message : "The user updated successfully.", data : userData})
                                            }
                                        });
                                    }
                                })
                            } else {
                                res.json({response : false, errors : {password : "Password is not match."}});
                            }
                        } else {
                            let userData = {
                                user_name : req.body.user_name, 
                                user_status : req.body.user_status,
                                role : req.body.role,
                                user_slug : slug,
                                sidebar_toggle : req.body.sidebar_toggle
                            }
                            User.findOneAndUpdate({_id : {$eq : _id}}, {$set : userData}, (err, data) => {
                                if(err) {
                                    res.json({response : false, errors : err});
                                    // return next(err);
                                } else {
                                    res.json({response : true, message : "The user updated successfully.", data : userData})
                                }
                            })
                        }

                    } else {
                        res.json({response:false, errors : {user_slug : "User name already taken."}});
                    }
                })    
            } else {
                res.json({response:false, errors : {email : "Email address already taken."}});
            }
        }
    })
}

exports.add_permission_for_user = (req, res, next) => {
    const user_slug = req.body.user_slug;
    const user_permission = req.body.user_permission;
    
    User.countDocuments({user_slug : {$eq : user_slug}}, (error, result) => {
        if(error) {
            res.json({response : false, errors : error});
            // return next(error);
        }
        else {
            console.log(result);
            if(result === 1) {
                const user_data = {
                    user_permission : user_permission
                }
                console.log(user_data);
                User.findOneAndUpdate({user_slug : {$eq : user_slug}}, {$set : user_data}, (error, data) => {
                    if(error) {
                        res.json({response : false, errors : error});
                        // return next(error);
                    } else {
                        res.json({response:true, message: `The permission added successfully.`});
                    }
                });
            }
            else {
                res.json({response:false, errors : {user_slug : "User slug is invaild."}});
            }
        }
    })
}

exports.toggle_update = (req, res, next) => {
    const _id = req.body._id;
     
    User.findOneAndUpdate({_id : {$eq : _id}}, {$set : {sidebar_toggle : req.body.sidebar_toggle}}, (error, result) => {
        if(error) {
            res.json({response : false, errors : error});
            // return next(error);
        } else {
            res.json({response : true, message : "The user updated successfully."});
        }
    })
}

exports.custom_theme_color = (req, res, next) => {
    const custom_theme = req.body.custom_theme;
    const _id = req.body.id;
    const _slug = req.body.user_slug;

    // User.findOne({$and : [{user_slug : {$eq : _slug}}, {_id : {$eq : _id}}]}, (error, userResult) => {
    //     if(error) { return next(error) }
    //     else {
    //         if(userResult.custom_theme.length > 0) {
    //             res.send(userResult.custom_theme.length)
    //         } else {
                User.findOneAndUpdate({$and : [{user_slug : {$eq : _slug}}, {_id : {$eq : _id}}]}, {$set : {custom_theme : custom_theme}}, (error, updateResult) => {
                    if(error) {  
                        res.json({response : false, errors : error});
                        // return next(error) 
                    }
                    else {
                        res.json({response : true, message : "Successfully added a custom theme."})
                    }
                })
        //     }
        // }
    // })
}

exports.changeStatus = (req, res, next) => {
    var _id = req.body._id;
    var status = req.body.status;
    var slug = req.body.slug;

    User.findOneAndUpdate({$and : [{_id : {$eq : _id}}, {user_slug : {$eq : slug}}]}, {$set : {user_status : status}}, (error, user) => {
        if(error) {
            res.json({response : false, errors : error});
            // return next(error);
        } else {
            res.json({response : true, message : "Successfully updated the status."})
        }
    })
}