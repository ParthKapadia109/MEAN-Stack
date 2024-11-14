const CMS = require('../model/cms');
var slugify = require('slugify');
const { response } = require('express');
const cms = require('../model/cms');

exports.cms_added = (req, res, next) => {
    const title = req.body.title
    const hading = req.body.hading
    const description = req.body.description
    const is_footer = req.body.footer
    const is_header = req.body.header
    const status = req.body.status
    const slug = create_slug(hading)

    CMS.countDocuments({slug : {$eq : slug}}, (error, cmsCount) => {
        if(error) {
            res.json({response : false, message : 'Some error is facing, Please try aging.', error : error})
        } else {
            if(cmsCount === 0) {
                const cmsData = {
                    title : title,
                    hading : hading,
                    description : description,
                    footer : is_footer,
                    header : is_header,
                    status : status,
                    slug : slug
                } 

                CMS.create(cmsData, (error, cmsAdded) => {
                    if(error) {
                        res.json({response : false, message : 'Some error is facing, Please try aging.', error : error})
                    } else {
                        res.json({response : true, message : 'Successfully add CMS ', data : cmsAdded})
                    }
                })
            } else {
                res.json({response : false, error : 'Cms is already exist.'})
            }
        }
    })
}

exports.get_cms = (req, res, next) =>{
    CMS.find((error, cmsData) => {
        if(error) {
            res.json({response : false, message : 'Some error is facing, Please try aging.', error : error})
        } else {
            res.json({response : true, message : 'Successfully get CMS Data ', data : cmsData})
        }
    })
}

exports.delete_cms = (req, res, next) => {
    const slug = req.params.slug
    const _id = req.params._id

    CMS.findOneAndDelete({$and : [{_id : {$eq : _id}}, {slug : {$eq : slug}}]}, (error, result) => {
        if(error) {
            res.json({response : false, message : 'Some error is facing, Please try aging.', error : error})
        } else {
            res.json({response : true, message : 'Successfully deleted CMS.'})
        }
    })
}

exports.edit_cms = (req, res, next) => {
    const slug = req.params.slug
    const _id = req.params._id

    CMS.findOne({$and : [{_id : {$eq : _id}}, {slug : {$eq : slug}}]}, (error, result) => {
        if(error) {
            res.json({response : false, message : 'Some error is facing, Please try aging.', error : error})
        } else {
            res.json({response : true, message : 'Successfully get CMS detail.', data : result})
        }
    })
}

exports.update_cms = (req, res, next) => {
    const _id = req.params._id
    const slug = create_slug(req.body.slug)

    CMS.countDocuments({$and : [{slug : {$eq : slug}}, {_id : {$ne : _id}}]}, (error, cmsCount) => {
        if(error) {
            res.json({response : false, message : 'Some error is facing, Please try aging.', error : error})
        } else {
            if(cmsCount === 0) {
                const cmsData = {
                    title : req.body.title,
                    hading : req.body.hading,
                    description : req.body.description,
                    footer : req.body.footer,
                    header : req.body.header,
                    status : req.body.status,
                    slug : slug
                } 

                CMS.findOneAndUpdate({_id : {$eq : _id}}, {$set : cmsData}, (error, cmsUpdate) => {
                    if(error) {
                        res.json({response : false, message : 'Some error is facing, Please try aging.', error : error})
                    } else {
                        res.json({response : true, message : 'Successfully updated CMS ', data : cmsUpdate})
                    }
                })
            } else {
                res.json({response : false, error : 'This slug already use.'})
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

exports.get_cms_detail = (req, res, next) => {
    const slug = req.params.slug

    CMS.findOne({slug : {$eq : slug}}, (error, result) => {
        if(error) {
            res.json({response : false, message : 'Some error is facing, Please try aging.', error : error})
        } else {
            res.json({response : true, message : 'Successfully get CMS detail ', data : result})
        }
    })
}

exports.get_cms_front = (req, res, next) =>{
    CMS.find({status : {$eq : true}}, (error, cmsData) => {
        if(error) {
            res.json({response : false, message : 'Some error is facing, Please try aging.', error : error})
        } else {
            res.json({response : true, message : 'Successfully get CMS data ', data : cmsData})
        }
    })
}

exports.changeStatus = (req, res, next) => {
    var _id = req.body._id;
    var header = req.body.header;
    var footer = req.body.footer;
    var status = req.body.status;

    var data = {
        header : header,
        footer : footer,
        status : status
    }

    CMS.findByIdAndUpdate(_id, {$set : data}, (error, result) => {
        if(error) {
            res.json({response : false, message : 'Some error is facing, Please try aging.', error : error})
        } else {
            res.json({response : true, message : 'Successfully update the data.'})
        }
    })
}