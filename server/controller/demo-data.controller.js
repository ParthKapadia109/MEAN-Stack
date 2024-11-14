const User = require("../model/user");
const Role = require("../model/role");
const Role_Auth = require("../model/role-auth");
const Module = require("../model/module");
var slugify = require("slugify");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const MailTemplate = require('../model/mailTemplate');
const MailSetting = require('../model/mail-setting');

exports.demo_data = (req, res, next) => {
    var role = "Supper Admin";
    var role_slug = generate_slug(role);

    var role_2 = "User";
    var role_slug_2 = generate_slug(role_2);

    const role_data = [
        {
            role_name: role,
            role_status: true,
            role_slug: role_slug,
        },
        {
            role_name: role_2,
            role_status: true,
            role_slug: role_slug_2,
        }
    ];

    Role.countDocuments({ role_slug: { $eq: role_slug } }, (error, count) => {
        if (error) {
            return next(error);
        } else {
            if (count >= 1) {
                res.send({ response: false, message: "Already exist the data in database " });
            } else {
                Role.create(role_data, (error, result) => {
                    if (error) {
                        return next(error);
                    } else {
                        const modules = [
                            {
                                title: "Role",
                                module_slug: "role",
                                sub_module: [
                                    {
                                        sub_module_title: "Add Role",
                                        sub_module_slug: "add-role",
                                    },
                                    {
                                        sub_module_title: "View Role",
                                        sub_module_slug: "view-role",
                                    },
                                    {
                                        sub_module_title: "Edit Role",
                                        sub_module_slug: "edit-role",
                                    },
                                    {
                                        sub_module_title: "Delete Role",
                                        sub_module_slug: "delete-role",
                                    },
                                    {
                                        sub_module_title: "Role Permission",
                                        sub_module_slug: "role-permission",
                                    },
                                ],
                                status: true,
                            },
                            {
                                title: "User",
                                module_slug: "user",
                                sub_module: [
                                    {
                                        sub_module_title: "Add User",
                                        sub_module_slug: "add-user",
                                    },
                                    {
                                        sub_module_title: "View User",
                                        sub_module_slug: "view-user",
                                    },
                                    {
                                        sub_module_title: "Delete User",
                                        sub_module_slug: "delete-user",
                                    },
                                    {
                                        sub_module_title: "Edit User",
                                        sub_module_slug: "edit-user",
                                    },
                                    {
                                        sub_module_title: "User Permission",
                                        sub_module_slug: "user-permission",
                                    },
                                ],
                                status: true,
                            },
                            {
                                title: "Module",
                                module_slug: "module",
                                sub_module: [
                                    {
                                        sub_module_title: "Add Module",
                                        sub_module_slug: "add-module",
                                    },
                                    {
                                        sub_module_title: "View Module",
                                        sub_module_slug: "view-module",
                                    },
                                    {
                                        sub_module_title: "Delete Module",
                                        sub_module_slug: "delete-module",
                                    },
                                    {
                                        sub_module_title: "Edit Module",
                                        sub_module_slug: "edit-module",
                                    },
                                ],
                                status: true,
                            },
                            {
                                title: "CMS",
                                module_slug: "cms",
                                sub_module: [
                                    {
                                        sub_module_title: "Add CMS",
                                        sub_module_slug: "add-cms",
                                    },
                                    {
                                        sub_module_title: "View CMS",
                                        sub_module_slug: "view-cms",
                                    },
                                    {
                                        sub_module_title: "Delete CMS",
                                        sub_module_slug: "delete-cms",
                                    },
                                    {
                                        sub_module_title: "Edit CMS",
                                        sub_module_slug: "edit-cms",
                                    },
                                ],
                                status: true,
                            },
                            {
                                title: "Mail Template",
                                module_slug: "mail-template",
                                sub_module: [
                                    {
                                        sub_module_title: "Add Mail Template",
                                        sub_module_slug: "add-mail-template",
                                    },
                                    {
                                        sub_module_title: "View Mail Template",
                                        sub_module_slug: "view-mail-template",
                                    },
                                    {
                                        sub_module_title: "Delete Mail Template",
                                        sub_module_slug: "delete-mail-template",
                                    },
                                    {
                                        sub_module_title: "Edit Mail Template",
                                        sub_module_slug: "edit-mail-template",
                                    },
                                ],
                                status: true,
                            }
                        ];
                        Module.create(modules, (error, module_data) => {
                            if (error) {
                                return next(error);
                            } else {
                                const sub_module = Array();

                                module_data.forEach((element) => {
                                    element.sub_module.forEach((ele) => {
                                        sub_module.push(ele.sub_module_slug);
                                    });
                                });

                                const role_auth = [{
                                    role_slug: role_slug,
                                    sub_module: sub_module,
                                    status: true,
                                },
                                {
                                    role_slug: role_slug_2,
                                    sub_module: [],
                                    status: true,
                                }
                                ];

                                Role_Auth.create(
                                    role_auth,
                                    (error, role_data) => {
                                        if (error) {
                                            return next(error);
                                        } else {
                                            const user_name = "Supper Admin";
                                            const user_slug = generate_slug(
                                                user_name
                                            );
                                            const password = "123456";

                                            bcrypt.hash(
                                                password,
                                                saltRounds,
                                                function (err_pwd, hash) {
                                                    if (err_pwd) {
                                                        return next(err_pwd);
                                                    } else {
                                                        const UserData = {
                                                            user_name: user_name,
                                                            email:
                                                                "info@supper-admin.com",
                                                            password: hash,
                                                            user_slug: user_slug,
                                                            role: role_slug,
                                                            user_status: true,
                                                            sidebar_toggle: false
                                                        };
                                                        User.create(
                                                            UserData,
                                                            (
                                                                error,
                                                                userdata
                                                            ) => {
                                                                if (error) {
                                                                    return next(
                                                                        error
                                                                    );
                                                                } else {

                                                                    const mailData = {
                                                                        template_name: "Forgot Password",
                                                                        subject: "Forgot Password",
                                                                        description: "<p>Forgot Password</p>\n\n<table align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"width:100%\">\n\t<tbody>\n\t\t<tr>\n\t\t\t<td>\n\t\t\t<table border=\"0\" cellpadding=\"30\" cellspacing=\"0\" style=\"width:600px\">\n\t\t\t\t<tbody>\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<td style=\"background-color:#ffffff; border-color:#dce1e5; border-style:solid; border-width:1px\">\n\t\t\t\t\t\t<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"width:100%\">\n\t\t\t\t\t\t\t<tbody>\n\t\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t\t<td style=\"vertical-align:top\">\n\t\t\t\t\t\t\t\t\t<h2>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <span class=\"marker\">{{subject}}</span></h2>\n\t\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t\t<td style=\"border-bottom:1px solid #dce1e5; border-top:1px solid #dce1e5; vertical-align:top\">\n\t\t\t\t\t\t\t\t\t<p><strong>&nbsp; &nbsp;Username:</strong> {{user_name}}</p>\n\n\t\t\t\t\t\t\t\t\t<p><strong>&nbsp; &nbsp;E-mail:</strong> {{email}}</p>\n\t\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t\t<td style=\"vertical-align:top\">\n\t\t\t\t\t\t\t\t\t<p><br />\n\t\t\t\t\t\t\t\t\t&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; ...... Forgot Password Link is Below .......</p>\n\t\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t\t<td style=\"vertical-align:top\">\n\t\t\t\t\t\t\t\t\t<h3>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;<a href=\"{{link}}\">Change my password</a></h3>\n\t\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t</tbody>\n\t\t\t\t\t\t</table>\n\t\t\t\t\t\t</td>\n\t\t\t\t\t</tr>\n\t\t\t\t</tbody>\n\t\t\t</table>\n\t\t\t</td>\n\t\t</tr>\n\t</tbody>\n</table>\n",
                                                                        status: true,
                                                                        slug: "forgot-password",
                                                                    }

                                                                    MailTemplate.create(mailData, (error, result) => {
                                                                        if (error) {
                                                                            return next(
                                                                                error
                                                                            );
                                                                        } else {
                                                                            
                                                                            const mailSetting = {
                                                                                service : "gmail",
                                                                                host : "",
                                                                                port: "587",
                                                                                secure: false,
                                                                                email: "vpn.testings@gmail.com",
                                                                                password: "glodctsgsefqheiw",
                                                                                mail_slug : "mail_configration"
                                                                            }

                                                                            MailSetting.create(mailSetting, (error, mailSeting) => {
                                                                                if (error) {
                                                                                    res.json({
                                                                                        response: false,
                                                                                        message:
                                                                                            "Something is worg please try again"
                                                                                    })
                                                                                } else {
                                                                                    res.json({
                                                                                        response: true,
                                                                                        message:
                                                                                            "Successfully Added the Data in Database",
                                                                                    });
                                                                                }
                                                                            })

                                                                        }
                                                                    })
                                                                }
                                                            }
                                                        );
                                                    }
                                                }
                                            );
                                        }
                                    }
                                );
                            }
                        });
                    }
                });
            }
        }
    });
};

function generate_slug(slug) {
    var create_slug = slugify(slug, {
        replacement: "-",
        remove: undefined,
        lower: true,
        strict: false,
        locale: "vi",
    });

    return create_slug;
}
