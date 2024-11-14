const { param, body, validationResult } = require('express-validator')

exports.roleValidation = () => {
  return [
    body('role_name').notEmpty().withMessage('Role Name is required !'),
    // body('role_slug').notEmpty().withMessage('Role Slug is required !'),
    body('role_status').notEmpty().withMessage('Role Status is required !')
  ]
}

exports.userValidation = () => {
  return [
    body('user_name').notEmpty().withMessage('User Name is required!'),
    body('email').notEmpty().withMessage('Email is required!'),
    body('password').notEmpty().withMessage('Password is required!'),
    body('confirm_password').notEmpty().withMessage('Confirm Password is required!'),
    body('role').notEmpty().withMessage('User Role is required!'),
    // body('user_slug').notEmpty().withMessage('User Slug is required!'),
    body('user_status').notEmpty().withMessage('User Status is required!'),
  ]
}
exports.validateUserToken = () => {
  return [
    body('token').notEmpty().withMessage('Token is required!')
  ]
}

exports.authLogin = () => {
  return [
    body('email').notEmpty().withMessage('Email is required!'),
    body('password').notEmpty().withMessage('Password is required!'),
  ]
}

exports.editUserValidation = () => {
  return [
    body('user_name').notEmpty().withMessage('User Name is required!'),
    body('email').notEmpty().withMessage('Email is required!'),
    body('role').notEmpty().withMessage('User Role is required!'),
    body('user_status').notEmpty().withMessage('User Status is required!'),
  ]
}

exports.moduleValidation = () => {
  return [
    body('title').notEmpty().withMessage('Module Title is required!'),
    body('sub_module_title').notEmpty().withMessage('Sub Module Title is required!'),
    body('status').notEmpty().withMessage('Status is required!'),
  ]
}

exports.roleAuth = () => {
  return [
    body('role_slug').notEmpty().withMessage('Role Slug is required!'),
    // body('sub_module').notEmpty().withMessage('Sub Module is required!'),
    body('status').notEmpty().withMessage('Status is required!'),
  ]
}

exports.user_permission = () => {
  return [
    body('user_slug').notEmpty().withMessage('User Slug is required!'),
    // body('user_permission').notEmpty().withMessage('User Permission is required!')
  ]
}

exports.forgotPassword = () => {
  return [
    body('email').notEmpty().withMessage('Email is required!'),
  ]
}

exports.recoverPassword = () => {
  return [
    body('email').notEmpty().withMessage('Email is required!'),
    body('password').notEmpty().withMessage('Password is required!'),
    body('confirm_password').notEmpty().withMessage('Confirm Password is required!')
  ]
}

exports.cmsValidation = () => {
  return [
    body('title').notEmpty().withMessage('The title field is require.'),
    body('hading').notEmpty().withMessage('The hading field is require.'),
    body('description').notEmpty().withMessage('The descripation field is require.'),
  ]
}

exports.mailValidation = () => {
  return [
    body('template_name').notEmpty().withMessage('The template name field is require.'),
    body('subject').notEmpty().withMessage('The subject field is require.'),
    body('description').notEmpty().withMessage('The descripation field is require.'),
  ]
}

exports.mailSettingValidation = () => {
  return [
    body('service').notEmpty().withMessage('The service field is require.'),
    body('port').notEmpty().withMessage('The port field is require.'),
    body('secure').notEmpty().withMessage('The secure field is require.'),
    body('email').notEmpty().withMessage('The email field is require.'),
    body('password').notEmpty().withMessage('The password field is require.'),
  ]
}

exports.validate = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
      return next()
    }
    const extractedErrors = []
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))
  
    return res.status(422).json({
      errors: extractedErrors,
    })
}

exports.langValidation = () => {
  return [
    body('value').notEmpty().withMessage('The value field is require.'),
  ]
}


