const User = require("../model/user");
const Role = require("../model/role");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const RoleAuth = require("../model/role-auth");
const Module = require("../model/module");
const nodemailer = require("nodemailer");
const saltRounds = 10;
const handlebars = require('handlebars');
const MailTemplate = require('../model/mailTemplate');
const MailSetting = require('../model/mail-setting');

exports.login_user = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email: { $eq: email } }, (error, user) => {
        if (error) {
            return next(error);
        } else {
            if (user) {
                if (user.user_status === true) {
                    bcrypt
                        .compare(password, user.password)
                        .then((match) => {
                            if (match) {
                                // Create a token
                                const payload = { user: user.email };
                                const options = { expiresIn: 60 * 60 };
                                const secret = "loginJWTTokenBaseVerification";
                                const token = jwt.sign(
                                    payload,
                                    secret,
                                    options
                                );

                                Role.findOne(
                                    { role_slug: { $eq: user.role } },
                                    (err, roleRes) => {
                                        if (err) {
                                            return next(err);
                                        } else {
                                            const RoleUser = roleRes.role_name;
                                            RoleAuth.find(
                                                {
                                                    role_slug: {
                                                        $eq: user.role,
                                                    },
                                                },
                                                (error, data) => {
                                                    if (error) {
                                                        return next(error);
                                                    } else {
                                                        let newPermissionArr = Array();
                                                        // if(user.user_permission.length <= 0) {
                                                        data[0].sub_module.map(
                                                            function (el) {
                                                                newPermissionArr.push(
                                                                    el
                                                                );
                                                            }
                                                        );
                                                        // } else {
                                                        user.user_permission.map(
                                                            function (el) {
                                                                newPermissionArr.push(
                                                                    el
                                                                );
                                                            }
                                                        );
                                                        // }

                                                        Module.find(
                                                            {
                                                                sub_module: {
                                                                    $elemMatch: {
                                                                        sub_module_slug: newPermissionArr,
                                                                    },
                                                                },
                                                            },
                                                            (error, data) => {
                                                                if (error) {
                                                                    return next(
                                                                        error
                                                                    );
                                                                } else {
                                                                    var newDataArr = Array();
                                                                    data.forEach(
                                                                        (
                                                                            element
                                                                        ) => {
                                                                            const add = {
                                                                                module_slug:
                                                                                    element.module_slug,
                                                                                title:
                                                                                    element.title,
                                                                                sub_module: element.sub_module.filter(
                                                                                    (
                                                                                        module
                                                                                    ) =>
                                                                                        newPermissionArr.includes(
                                                                                            module.sub_module_slug
                                                                                        )
                                                                                ),
                                                                            };
                                                                            newDataArr.push(
                                                                                add
                                                                            );
                                                                        }
                                                                    );
                                                                    const userData = {
                                                                        user_name:
                                                                            user.user_name,
                                                                        email:
                                                                            user.email,
                                                                        user_slug:
                                                                            user.user_slug,
                                                                        permission: newDataArr,
                                                                        role: RoleUser,
                                                                        sidebar_toggle: user.sidebar_toggle,
                                                                        _id : user._id,
                                                                        custom_theme : user.custom_theme
                                                                    };
                                                                    res.json({
                                                                        response: true,
                                                                        data: userData,
                                                                        message:
                                                                            "Successfully login.",
                                                                        token: token,
                                                                    });
                                                                }
                                                            }
                                                        );
                                                    }
                                                }
                                            );
                                        }
                                    }
                                );
                            } else {
                                res.json({
                                    response: false,
                                    message: "Please enter valid password.",
                                });
                            }
                        })
                        .catch((err) => {
                            return next(err);
                        });
                } else {
                    res.json({
                        response: false,
                        message: "Your account is block.",
                    });
                }
            } else {
                res.json({
                    response: false,
                    message: "Invalid email and password.",
                });
            }
        }
    });
};

exports.logout = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    jwt.destroy(token);
    res.json({ response: true, message: "Successfully logout." });
};

exports.forgotPassword = (req, res, next) => {
    const email = req.body.email;
    User.countDocuments({ email: { $eq: email } }, (error, userCount) => {
        if (error) {
            return next(error);
        } else {
            if (userCount === 1) {
                User.find({ email: { $eq: email } }, (error, userData) => {
                    if (error) {
                        return next(error);
                    }
                    const payload = {
                        user: { email: userData[0].email, id: userData[0]._id },
                    };
                    const options = { expiresIn: 60 };
                    const secret = "forgotPasswordJWTTokenBaseVerification";
                    const token = jwt.sign(payload, secret, options);

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

                            MailTemplate.findOne({slug : {$eq : 'forgot-password'}}, (error, html) => {
                                if(error) {
                                    res.json({response : false, message : "Something went wrong please try again."})
                                } else {
                                    
                                    var template = handlebars.compile(html.description);
                                    var replacements = {
                                        user_name: userData[0].user_name,
                                        email : email,
                                        // Server Detail
                                        reset_password_link : "http://68.183.86.2:8000/node/angular"+"/recover-password/"+token+"/"+email,
                                        link : "http://68.183.86.2:8000/node/angular"+"/recover-password/"+token+"/"+email
                                        // Local Detail
                                        // reset_password_link : "http://localhost:4200"+"/recover-password/"+token+"/"+email,
                                        // link : "http://localhost:4200"+"/recover-password/"+token+"/"+email,
                                    };
                                    var htmlToSend = template(replacements);
                                    var mailOptions = {
                                        from: mailData['email'],
                                        to: email,
                                        subject: 'Forgot Password',
                                        html: htmlToSend
                                    };
                                    transporter.sendMail(mailOptions, function(error, info) {
                                        if (error) {
                                        return next(error)
                                        } else {
                                        res.json({
                                                response: true,
                                                message:
                                                    "A mail sent to your email address. Please check the link in mail for new password.",
                                                data : info
                                            })
                                        }
                                    });
                                }
                            });
                        }
                    });

                    

                });
            } else {
                res.json({ response: false, error: "Invaild email address." });
            }
        }
    });
};

exports.recoverPassword = (req, res, next) => {
    const token = req.body.token;
    const email = req.body.email;
    const password = req.body.password;
    const confirm_password = req.body.confirm_password;

    const options = {
        expiresIn: 60,
    };
    try {
        result = jwt.verify(
            token,
            "forgotPasswordJWTTokenBaseVerification",
            options
        );

        req.decoded = result;
        const checkToken = result;
        if (email === checkToken.user.email) {
            if (password === confirm_password) {
                bcrypt.hash(password, saltRounds, function (err_pwd, hash) {
                    if (err_pwd) {
                        return next(err_pwd);
                    } else {
                        const updateData = {
                            password: hash,
                        };
                        User.findOneAndUpdate(
                            { email: { $eq: email } },
                            { $set: updateData },
                            (error, userUpdate) => {
                                if (error) {
                                    return next(error);
                                } else {
                                    res.json({
                                        response: true,
                                        message:
                                            "Successfully change the password, Please Login",
                                        data: userUpdate,
                                    });
                                }
                            }
                        );
                    }
                });
            } else {
                res.json({ response: false, error: "Password in not match." });
            }
        } else {
            res.json({ response: false, error: "Email address is invalid." });
        }
    } catch (err) {
        // Throw an error just in case anything goes wrong with verification
        result = {
            error: `Authentication error. Token is invalid.`,
            status: 401,
        };
        res.status(401).send(result);
    }
};

exports.front_login_user = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email: { $eq: email } }, (error, user) => {
        if (error) {
            return next(error);
        } else {
            if (user) {
                if(user.role == 'user') {
                    if (user.user_status === true && user.user_activated_status === true) {
                        bcrypt
                            .compare(password, user.password)
                            .then((match) => {
                                if (match) {
                                    // Create a token
                                    const payload = { user: user.email };
                                    const options = { expiresIn: 60 * 60 };
                                    const secret = "loginJWTTokenBaseVerification";
                                    const token = jwt.sign(
                                        payload,
                                        secret,
                                        options
                                    );

                                    Role.findOne(
                                        { role_slug: { $eq: user.role } },
                                        (err, roleRes) => {
                                            if (err) {
                                                return next(err);
                                            } else {
                                                const RoleUser = roleRes.role_name;
                                                RoleAuth.find(
                                                    {
                                                        role_slug: {
                                                            $eq: user.role,
                                                        },
                                                    },
                                                    (error, data) => {
                                                        if (error) {
                                                            return next(error);
                                                        } else {
                                                            let newPermissionArr = Array();
                                                            // if(user.user_permission.length <= 0) {
                                                            data[0].sub_module.map(
                                                                function (el) {
                                                                    newPermissionArr.push(
                                                                        el
                                                                    );
                                                                }
                                                            );
                                                            // } else {
                                                            user.user_permission.map(
                                                                function (el) {
                                                                    newPermissionArr.push(
                                                                        el
                                                                    );
                                                                }
                                                            );
                                                            // }

                                                            Module.find(
                                                                {
                                                                    sub_module: {
                                                                        $elemMatch: {
                                                                            sub_module_slug: newPermissionArr,
                                                                        },
                                                                    },
                                                                },
                                                                (error, data) => {
                                                                    if (error) {
                                                                        return next(
                                                                            error
                                                                        );
                                                                    } else {
                                                                        var newDataArr = Array();
                                                                        data.forEach(
                                                                            (
                                                                                element
                                                                            ) => {
                                                                                const add = {
                                                                                    module_slug:
                                                                                        element.module_slug,
                                                                                    title:
                                                                                        element.title,
                                                                                    sub_module: element.sub_module.filter(
                                                                                        (
                                                                                            module
                                                                                        ) =>
                                                                                            newPermissionArr.includes(
                                                                                                module.sub_module_slug
                                                                                            )
                                                                                    ),
                                                                                };
                                                                                newDataArr.push(
                                                                                    add
                                                                                );
                                                                            }
                                                                        );
                                                                        const userData = {
                                                                            user_name:
                                                                                user.user_name,
                                                                            email:
                                                                                user.email,
                                                                            user_slug:
                                                                                user.user_slug,
                                                                            permission: newDataArr,
                                                                            role: RoleUser,
                                                                            sidebar_toggle: user.sidebar_toggle,
                                                                            _id : user._id,
                                                                            custom_theme : user.custom_theme
                                                                        };
                                                                        res.json({
                                                                            response: true,
                                                                            data: userData,
                                                                            message:
                                                                                "Successfully login.",
                                                                            token: token,
                                                                        });
                                                                    }
                                                                }
                                                            );
                                                        }
                                                    }
                                                );
                                            }
                                        }
                                    );
                                } else {
                                    res.json({
                                        response: false,
                                        message: "Please enter valid password.",
                                    });
                                }
                            })
                            .catch((err) => {
                                return next(err);
                            });
                    } else {
                        res.json({
                            response: false,
                            message: "Your account is block or inactive. For active your account please check you email.",
                        });
                    }
                } 
                else {
                    res.json({
                        response: false,
                        message: "You have not permission to login.",
                    }); 
                }
            }
            else {
                res.json({
                    response: false,
                    message: "Invalid email and password.",
                });
            }
        }
    });
};
