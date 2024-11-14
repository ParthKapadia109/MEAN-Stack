var MailSetting = require('../model/mail-setting')
var nodemailer = require("nodemailer");
var fs = require("fs");

exports.mailConfiguration = (req, res) => {
    var mailData = {
        service : req.body.service,
        host : req.body.host,
        port : req.body.port,
        secure : req.body.secure,
        email : req.body.email,
        password : req.body.password
    }

    MailSetting.findOneAndUpdate({ mail_slug: { $eq: 'mail_configration' } }, { $set: mailData }, (error, result) => {
        if (error) {
            res.json({ response: false, message: "Something went wrong please try again", error: error });
        } else {
            res.json({ response: true, message: "The mail configuration updated successfully." })
        }
    });
}

exports.testingMail = (req, res) => {

    MailSetting.findOne({ mail_slug: { $eq: 'mail_configration' } }, (error, mailData) => {
        if (error) {
            res.json({ response: false, message: "Something went wrong please try again", error: error });
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

            fs.readFile('controller/testMail.html', { encoding: 'utf-8' }, function (err, html) {
                if (err) {
                    res.json({ response: false, message: "Something went wrong please try again", error: error });
                } else {
                    var mailOptions = {
                        from: mailData['email'],
                        to: mailData['email'],
                        subject: 'Testing Purpose',
                        text: 'For clients with plaintext support only',
                        html: html
                    };
                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            res.json({ response: false, message: "Something went wrong please try again", error: error });
                        } else {
                            res.json({
                                response: true,
                                message:
                                    "Mail configuration data is valid. please check your mail box.",
                                data: info
                            })
                        }
                    });
                }
            })

        }
    })

}

exports.getMailConfiguration = (req, res) => {
    MailSetting.findOne({ mail_slug: { $eq: 'mail_configration' } }, (error, result) => {
        if (error) {
            res.json({ response: false, message: "Something went wrong please try again", error: error });
        } else {
            res.json({ response: true, message: "The Mail configuration data fetch successfully.", data: result });
        }
    });
}