const Lang = require('../model/lang');
const UserSelectedLang = require('../model/user_selected_lang');
const { response } = require('express');

exports.lang_added = (req, res, next) => {
    const uid = req.body.uid;
    const value = req.body.value;
    const is_selected = req.body.is_selected;
    const status = req.body.status;

    Lang.countDocuments({value : {$eq : value}}, (error, langCount) => {
        if(error) {
            res.json({response : false, message : 'Some error is facing, Please try aging.', error : error})
        } else {
            if(langCount === 1) {
                res.json({response : false, errors : {email : "Email is already existing."}});
           } else {
                if(langCount === 0) {
                    const langData = {
                        uid: uid,
                        value : value,
                        is_selected: is_selected,
                        status : status
                    } 
                    Lang.create(langData, (error, langAdded) => {
                        if(error) {
                            res.json({response : false, message : 'Some error is facing, Please try aging.', error : error})
                        } else {
                            res.json({response : true, message : 'Successfully added CMS ', data : langAdded})
                        }
                    })
                } else {
                    res.json({response : false, error : 'CMS is already exist.'})
                }
            }
        }
    })
}

exports.get_lang = (req, res, next) =>{
    Lang.find({status : {$eq : req.body.status}}, (error, langData) => {
        if(error) {
            res.json({response : false, message : 'Some error is facing, Please try aging.', error : error})
        } else {
            res.json({response : true, message : 'Successfully get language ', data : langData})
        }
    })
}

exports.get_user_selected_lang = (req, res, next) =>{
    UserSelectedLang.find({uid: {$eq : req.body.uid}}, (error, userSelectedLang) => {
        if(error) {
            res.json({response : false, message : 'Some error is facing, Please try aging.', error : error})
        } else {
            res.json({response : true, message : 'Successfully get language ', data : userSelectedLang})
        }
    })
}

exports.update_lang = (req, res, next) => {
    const uid = req.body.uid;

    UserSelectedLang.find({uid : {$eq : uid}}, (error, langCount) => {
        if(error) {
            res.json({response : false, message : 'Some error is facing, Please try aging.', error : error})
        } else {
            if(langCount.length > 0) {
                const langData = {
                    value : req.body.value
                } 
                UserSelectedLang.findOneAndUpdate({uid : {$eq : uid}}, {$set : langData}, (error, langUpdate) => {
                    if(error) {
                        res.json({response : false, message : 'Some error is facing, Please try aging.', error : error})
                    } else {
                        res.json({response : true, message : 'Successfully Updated language ', data : langUpdate})
                    }
                })
            } else {
                const langData = {
                    uid: uid,
                    value : req.body.value,
                } 
                UserSelectedLang.create(langData, (error, langAdded) => {
                    if(error) {
                        res.json({response : false, message : 'Some error is facing, Please try aging.', error : error})
                    } else {
                        res.json({response : true, message : 'Successfully add selected language ', data : langAdded})
                    }
                })
                // res.json({response : false, error : 'This id already use.'})
            }
        }
    })

}
