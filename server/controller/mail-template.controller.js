var MailTemplate = require('../model/mailTemplate');
var slugify = require('slugify')
// var {encode, decode} = require('html-entities');

exports.addMailTemplate = (req, res) => {
    var template_name = req.body.template_name;
    var subject = req.body.subject;
    var description = req.body.description;
    var status = req.body.status;
    var slug = generateSlug(template_name);

    MailTemplate.countDocuments({slug : {$eq : slug}}, (error, result) => {
        if(error) {
            res.json({response : false, message : "Something went wrong please try again."})
        } else {
            if(result == 0) {
                const data = {
                    template_name : template_name,
                    subject : subject,
                    description : description,
                    status : status,
                    slug : slug
                }
                MailTemplate.create(data, (error, mail) => {
                    if(error) {
                        res.json({response : false, message : "Something went wrong please try again."})
                    } else {
                        res.json({response : true, message : "Successfully inserted the data."})
                    }
                })
            } else {
                res.json({response : false, message : "This template name is already exist."})
            }
        }
    })
}

exports.viewMailTemplate = (req, res) => {
    MailTemplate.find((error, mailData) => {
        if(error) {
            res.json({response : false, message : "Something went wrong please try again."})
        } else {
            res.json({response : true, message : "Successfully get the data ", data: mailData});
        }
    })
} 

exports.findMailDetails = (req, res) => {
    var slug = req.params.slug;
    var id = req.params.id;

    MailTemplate.findOne({$and : [{_id : {$eq : id}}, {slug : {$eq : slug}}]}, (error, mailData) => {
        if(error) {
            res.json({response : false, message : "Something went wrong please try again."})
        } else {
            res.json({response : true, message : "Successfully get the data ", data: mailData});
        }
    })
}

exports.updateMailDetails = (req, res) => {
    var id = req.params.id; 
    var template_name = req.body.template_name;
    var subject = req.body.subject;
    var description = req.body.description;
    // var descDecode = decode(description);
    // console.log(descDecode);
    var status = req.body.status;
    var slug = req.body.slug;

    MailTemplate.countDocuments({$and : [{slug : {$eq : slug}}, {_id : {$ne : id}}]}, (error, result) => {
        if(error) {
            res.json({response : false, message : "Something went wrong please try again."})
        } else {
            if(result == 0) {
                const data = {
                    // template_name : template_name,
                    subject : subject,
                    description : description,
                    status : status,
                    // slug : slug
                }
                MailTemplate.findByIdAndUpdate(id, {$set : data}, (error, mailData) => {
                    if(error) {
                        res.json({response : false, message : "Something went wrong please try again."})
                    } else {
                        res.json({response : true, message : "Successfully update the data."})
                    }
                })
            } else {
                res.json({response : false, message : "This template name is already exist."})
            } 
        }
    })   
}

exports.deleteMailDetails = (req, res) => {
    var id = req.params.id;
    MailTemplate.findByIdAndDelete(id, (error, result) => {
        if(error) {
            res.json({response : false, message : "Something went wrong please try again."})
        } else {
            res.json({response : true, message : "Successfully deleted the data."})
        }
    })
}

exports.changeStatus = (req, res) =>  {
    var id = req.params.id;
    MailTemplate.findByIdAndUpdate(id, {$set : {status : req.body.status}}, (error, result) => {
        if(error) {
            res.json({response : false, message : "Something went wrong please try again."})
        } else {
            res.json({response : true, message : "Successfully updated the data."})
        }
    })
}

function generateSlug(text){
    var slug = slugify(text, {
        replacement: '-',  // replace spaces with replacement character, defaults to `-`
        remove: undefined, // remove characters that match regex, defaults to `undefined`
        lower: true,      // convert to lower case, defaults to `false`
        strict: false,     // strip special characters except replacement, defaults to `false`
        locale: 'vi'       // language code of the locale to use
    });
    return slug;
}